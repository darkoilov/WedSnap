import type { UploadStatus, MediaType } from "@prisma/client"

import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "@/lib/validation"

export function isUploadOwnedByEvent(input: {
  uploadEventId: string
  eventId: string
}) {
  return input.uploadEventId === input.eventId
}

export function isGalleryEligibleUpload(input: {
  deletedAt: Date | null
  status: UploadStatus
  mediaType: MediaType
}) {
  return (
    input.deletedAt === null &&
    input.status === "PROCESSED" &&
    input.mediaType === "IMAGE"
  )
}

export function getUploadDeletionKeys(input: {
  storageKeyOriginal: string
  storageKeyOptimized?: string | null
  storageKeyThumbnail?: string | null
}) {
  return [
    input.storageKeyOriginal,
    input.storageKeyOptimized,
    input.storageKeyThumbnail,
  ].filter((key): key is string => Boolean(key))
}

export function calculateStorageUsedMb(input: {
  originalBytes?: number | null
  optimizedBytes?: number | null
  thumbnailBytes?: number | null
}) {
  const totalBytes =
    (input.originalBytes ?? 0) +
    (input.optimizedBytes ?? 0) +
    (input.thumbnailBytes ?? 0)

  return Math.ceil(totalBytes / (1024 * 1024))
}

export function validateUploadInitRules(input: {
  eventStatus: "active" | "full" | "closed"
  allowVideos: boolean
  fileType: string
  fileSize: number
  maxImageBytes: number
  maxVideoBytes: number
  remainingStorageMb: number
  activeUploadCount: number
  maxFiles: number
}) {
  if (input.eventStatus !== "active") {
    return {
      ok: false,
      code: "EVENT_UPLOAD_DISABLED",
    } as const
  }

  const isImage = IMAGE_MIME_TYPES.includes(
    input.fileType as (typeof IMAGE_MIME_TYPES)[number]
  )
  const isVideo = VIDEO_MIME_TYPES.includes(
    input.fileType as (typeof VIDEO_MIME_TYPES)[number]
  )

  if (!isImage && !isVideo) {
    return {
      ok: false,
      code: "INVALID_FILE_TYPE",
    } as const
  }

  if (isVideo && !input.allowVideos) {
    return {
      ok: false,
      code: "VIDEOS_DISABLED",
    } as const
  }

  const maxBytes = isImage ? input.maxImageBytes : input.maxVideoBytes
  if (input.fileSize > maxBytes) {
    return {
      ok: false,
      code: "FILE_TOO_LARGE",
    } as const
  }

  const incomingFileMb = Math.ceil(input.fileSize / (1024 * 1024))
  if (incomingFileMb > input.remainingStorageMb) {
    return {
      ok: false,
      code: "EVENT_STORAGE_LIMIT_REACHED",
    } as const
  }

  if (input.activeUploadCount >= input.maxFiles) {
    return {
      ok: false,
      code: "EVENT_FILE_LIMIT_REACHED",
    } as const
  }

  return {
    ok: true,
  } as const
}
