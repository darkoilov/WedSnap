import { NextResponse } from "next/server"

import { ApiRouteError, toApiErrorPayload } from "@/lib/api-errors"
import { getEventBySlug } from "@/lib/events"
import { logger } from "@/lib/logger"
import { deleteObject } from "@/lib/r2"
import {
  getUploadById,
  softDeleteUpload,
  updateEventStorageUsedMb,
} from "@/lib/uploads"
import { eventSlugSchema } from "@/lib/validation"
import {
  getUploadDeletionKeys,
  isUploadOwnedByEvent,
} from "@/lib/upload-policies"

interface RouteContext {
  params: Promise<{
    uploadId: string
  }>
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const resolvedParams = await params
    const body = await request.json().catch(() => null)
    const parsedEventSlug = eventSlugSchema.safeParse(body?.eventSlug)

    if (!parsedEventSlug.success) {
      throw new ApiRouteError({
        code: "INVALID_EVENT_SLUG",
        message: "Invalid event slug.",
        status: 400,
      })
    }

    const [event, upload] = await Promise.all([
      getEventBySlug(parsedEventSlug.data),
      getUploadById(resolvedParams.uploadId),
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
      upload.deletedAt ||
      !isUploadOwnedByEvent({ uploadEventId: upload.eventId, eventId: event.id })
    ) {
      throw new ApiRouteError({
        code: "UPLOAD_NOT_FOUND",
        message: "Upload not found for this event.",
        status: 404,
      })
    }

    const deletionKeys = getUploadDeletionKeys({
      storageKeyOriginal: upload.storageKeyOriginal,
      storageKeyOptimized: upload.storageKeyOptimized,
      storageKeyThumbnail: upload.storageKeyThumbnail,
    })

    await Promise.allSettled(deletionKeys.map((key) => deleteObject(key)))
    await softDeleteUpload(upload.id)
    const storageUsedMb = await updateEventStorageUsedMb(event.id)

    logger.info("admin.upload.deleted", {
      uploadId: upload.id,
      eventId: event.id,
      storageUsedMb,
    })

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      storageUsedMb,
    })
  } catch (error) {
    const payload = toApiErrorPayload(error)

    logger.error("admin.upload.delete_failed", {
      code: payload.body.error.code,
      status: payload.status,
      message:
        error instanceof Error ? error.message : "Unknown admin delete failure",
    })

    return NextResponse.json(payload.body, { status: payload.status })
  }
}
