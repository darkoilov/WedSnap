import { NextResponse } from "next/server"

import { ApiRouteError, toApiErrorPayload } from "@/lib/api-errors"
import { getEventBySlug } from "@/lib/events"
import { generateImageDerivatives } from "@/lib/image-processing"
import { logger } from "@/lib/logger"
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit"
import { getObjectBuffer, headObjectIfExists, putObject } from "@/lib/r2"
import {
  buildOptimizedStorageKey,
  buildThumbnailStorageKey,
} from "@/lib/storage-keys"
import {
  getUploadById,
  markUploadFailed,
  markUploadProcessed,
  markUploadUploaded,
  updateEventStorageUsedMb,
} from "@/lib/uploads"
import { uploadCompleteSchema } from "@/lib/validation"
import { isUploadOwnedByEvent } from "@/lib/upload-policies"

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  try {
    const rateLimit = consumeRateLimit({
      key: `upload-complete:${clientIp}`,
      limit: 20,
      windowMs: 60_000,
    })

    if (!rateLimit.allowed) {
      throw new ApiRouteError({
        code: "RATE_LIMITED",
        message: "Too many upload attempts. Please wait and try again.",
        status: 429,
      })
    }

    const body = await request.json().catch(() => null)
    const parsed = uploadCompleteSchema.safeParse(body)

    if (!parsed.success) {
      throw new ApiRouteError({
        code: "INVALID_UPLOAD_COMPLETE_REQUEST",
        message: "Invalid upload completion request.",
        status: 400,
        details: parsed.error.flatten(),
      })
    }

    const { uploadId, eventSlug } = parsed.data
    const [event, upload] = await Promise.all([
      getEventBySlug(eventSlug),
      getUploadById(uploadId),
    ])

    if (!event) {
      throw new ApiRouteError({
        code: "EVENT_NOT_FOUND",
        message: "Event not found.",
        status: 404,
      })
    }

    if (
      !upload ||
      !isUploadOwnedByEvent({ uploadEventId: upload.eventId, eventId: event.id })
    ) {
      throw new ApiRouteError({
        code: "UPLOAD_NOT_FOUND",
        message: "Upload not found for this event.",
        status: 404,
      })
    }

    const object = await headObjectIfExists(upload.storageKeyOriginal)
    if (!object.exists) {
      throw new ApiRouteError({
        code: "UPLOAD_OBJECT_MISSING",
        message: "Uploaded file could not be found in storage.",
        status: 409,
      })
    }

    let updatedUpload

    if (upload.mediaType === "IMAGE") {
      try {
        const originalBuffer = await getObjectBuffer(upload.storageKeyOriginal)
        const derivatives = await generateImageDerivatives(originalBuffer)
        const optimizedKey = buildOptimizedStorageKey({
          eventId: event.id,
          uploadId: upload.id,
        })
        const thumbnailKey = buildThumbnailStorageKey({
          eventId: event.id,
          uploadId: upload.id,
        })

        await Promise.all([
          putObject({
            key: optimizedKey,
            body: derivatives.optimizedBuffer,
            contentType: "image/webp",
            cacheControl: "public, max-age=31536000, immutable",
          }),
          putObject({
            key: thumbnailKey,
            body: derivatives.thumbnailBuffer,
            contentType: "image/webp",
            cacheControl: "public, max-age=31536000, immutable",
          }),
        ])

        updatedUpload = await markUploadProcessed({
          id: upload.id,
          storageKeyOptimized: optimizedKey,
          storageKeyThumbnail: thumbnailKey,
          optimizedSizeBytes: derivatives.optimizedBuffer.length,
          thumbnailSizeBytes: derivatives.thumbnailBuffer.length,
          width: derivatives.width,
          height: derivatives.height,
        })
      } catch (error) {
        await markUploadFailed(upload.id)
        logger.error("upload.complete.processing_failed", {
          uploadId: upload.id,
          eventId: event.id,
          message: error instanceof Error ? error.message : "Unknown processing error",
        })

        throw new ApiRouteError({
          code: "IMAGE_PROCESSING_FAILED",
          message: "Image processing failed after upload.",
          status: 500,
        })
      }
    } else {
      updatedUpload = await markUploadUploaded({ id: upload.id })
    }

    const storageUsedMb = await updateEventStorageUsedMb(event.id)

    logger.info("upload.complete.succeeded", {
      uploadId: updatedUpload.id,
      eventId: updatedUpload.eventId,
      status: updatedUpload.status,
      storageUsedMb,
    })

    return NextResponse.json({
      success: true,
      upload: {
        id: updatedUpload.id,
        status: updatedUpload.status.toLowerCase(),
        eventId: updatedUpload.eventId,
        storageKeyOriginal: updatedUpload.storageKeyOriginal,
      },
      storageUsedMb,
    })
  } catch (error) {
    const payload = toApiErrorPayload(error)

    logger.error("upload.complete.failed", {
      clientIp,
      code: payload.body.error.code,
      status: payload.status,
      message:
        error instanceof Error ? error.message : "Unknown upload complete failure",
    })

    return NextResponse.json(payload.body, { status: payload.status })
  }
}
