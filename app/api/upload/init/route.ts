import { randomUUID } from "crypto"

import { NextResponse } from "next/server"

import { ApiRouteError, toApiErrorPayload } from "@/lib/api-errors"
import { getEnv } from "@/lib/env"
import { getEventBySlug, mapDbEventStatus } from "@/lib/events"
import { logger } from "@/lib/logger"
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit"
import { createSignedUploadUrl } from "@/lib/r2"
import { buildOriginalStorageKey } from "@/lib/storage-keys"
import { countActiveUploadsForEvent, createPendingUpload } from "@/lib/uploads"
import {
  getMediaTypeFromMimeType,
  uploadInitSchema,
} from "@/lib/validation"
import { validateUploadInitRules } from "@/lib/upload-policies"

function getMaxFileSizeBytes(fileType: string) {
  const env = getEnv()

  if (fileType.startsWith("image/")) {
    return env.MAX_UPLOAD_MB_DEFAULT * 1024 * 1024
  }

  return 100 * 1024 * 1024
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  try {
    const rateLimit = consumeRateLimit({
      key: `upload-init:${clientIp}`,
      limit: 10,
      windowMs: 60_000,
    })

    if (!rateLimit.allowed) {
      logger.warn("upload.init.rate_limited", {
        clientIp,
        resetAt: rateLimit.resetAt,
      })

      throw new ApiRouteError({
        code: "RATE_LIMITED",
        message: "Too many upload attempts. Please wait and try again.",
        status: 429,
      })
    }

    const body = await request.json().catch(() => null)
    const parsed = uploadInitSchema.safeParse(body)

    if (!parsed.success) {
      throw new ApiRouteError({
        code: "INVALID_UPLOAD_REQUEST",
        message: "Invalid upload request.",
        status: 400,
        details: parsed.error.flatten(),
      })
    }

    const { eventSlug, fileName, fileType, fileSize } = parsed.data
    const event = await getEventBySlug(eventSlug)

    if (!event) {
      throw new ApiRouteError({
        code: "EVENT_NOT_FOUND",
        message: "Event not found.",
        status: 404,
      })
    }

    const activeUploadCount = await countActiveUploadsForEvent(event.id)
    const eventStatus = mapDbEventStatus(event.status)
    const validationResult = validateUploadInitRules({
      eventStatus,
      allowVideos: event.allowVideos,
      fileType,
      fileSize,
      maxImageBytes: getEnv().MAX_UPLOAD_MB_DEFAULT * 1024 * 1024,
      maxVideoBytes: 100 * 1024 * 1024,
      remainingStorageMb: Math.max(event.maxStorageMb - event.storageUsedMb, 0),
      activeUploadCount,
      maxFiles: event.maxFiles,
    })

    if (!validationResult.ok) {
      const statusMap = {
        EVENT_UPLOAD_DISABLED: 409,
        INVALID_FILE_TYPE: 400,
        VIDEOS_DISABLED: 400,
        FILE_TOO_LARGE: 400,
        EVENT_STORAGE_LIMIT_REACHED: 409,
        EVENT_FILE_LIMIT_REACHED: 409,
      } as const

      const messageMap = {
        EVENT_UPLOAD_DISABLED:
          eventStatus === "full"
            ? "Upload limit has been reached for this event."
            : "This event is closed for uploads.",
        INVALID_FILE_TYPE: "This file type is not allowed.",
        VIDEOS_DISABLED: "This event does not allow video uploads.",
        FILE_TOO_LARGE: `File exceeds the size limit of ${Math.round(
          getMaxFileSizeBytes(fileType) / (1024 * 1024)
        )} MB.`,
        EVENT_STORAGE_LIMIT_REACHED:
          "This event does not have enough remaining storage.",
        EVENT_FILE_LIMIT_REACHED: "This event has reached its file limit.",
      } as const

      throw new ApiRouteError({
        code: validationResult.code,
        message: messageMap[validationResult.code],
        status: statusMap[validationResult.code],
      })
    }

    const uploadId = randomUUID()
    const mediaType = getMediaTypeFromMimeType(fileType)
    const fileKey = buildOriginalStorageKey({
      eventId: event.id,
      uploadId,
      filename: fileName,
    })

    const signedUpload = await createSignedUploadUrl({
      key: fileKey,
      contentType: fileType,
    })

    await createPendingUpload({
      id: uploadId,
      eventId: event.id,
      originalFilename: fileName,
      storageKeyOriginal: fileKey,
      mimeType: fileType,
      mediaType,
      sizeBytes: fileSize,
    })

    logger.info("upload.init.created", {
      uploadId,
      eventId: event.id,
      clientIp,
      mediaType,
      fileSize,
    })

    return NextResponse.json({
      uploadId,
      fileKey,
      uploadUrl: signedUpload.uploadUrl,
      headers: signedUpload.headers,
      expiresInSeconds: getEnv().SIGNED_URL_EXPIRY_SECONDS,
    })
  } catch (error) {
    const payload = toApiErrorPayload(error)

    logger.error("upload.init.failed", {
      clientIp,
      code: payload.body.error.code,
      status: payload.status,
      message:
        error instanceof Error ? error.message : "Unknown upload init failure",
    })

    return NextResponse.json(payload.body, { status: payload.status })
  }
}
