import "server-only"

import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"

export const adminUploadSelect = {
  id: true,
  eventId: true,
  originalFilename: true,
  storageKeyOriginal: true,
  storageKeyOptimized: true,
  storageKeyThumbnail: true,
  mimeType: true,
  mediaType: true,
  sizeBytes: true,
  width: true,
  height: true,
  status: true,
  uploadedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UploadSelect

export const galleryUploadSelect = {
  id: true,
  eventId: true,
  storageKeyOriginal: true,
  storageKeyOptimized: true,
  storageKeyThumbnail: true,
  mediaType: true,
  uploadedAt: true,
} satisfies Prisma.UploadSelect

export async function getUploadsForEvent(eventId: string) {
  return db.upload.findMany({
    where: {
      eventId,
      deletedAt: null,
      status: {
        in: ["UPLOADED", "PROCESSED"],
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: adminUploadSelect,
  })
}

export async function getGalleryUploadsForEvent(eventId: string) {
  return db.upload.findMany({
    where: {
      eventId,
      deletedAt: null,
      status: "PROCESSED",
      mediaType: "IMAGE",
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: galleryUploadSelect,
  })
}

export async function countActiveUploadsForEvent(eventId: string) {
  return db.upload.count({
    where: {
      eventId,
      status: {
        not: "DELETED",
      },
      deletedAt: null,
    },
  })
}

export async function createPendingUpload(input: {
  id: string
  eventId: string
  originalFilename: string
  storageKeyOriginal: string
  mimeType: string
  mediaType: "image" | "video"
  sizeBytes: number
}) {
  return db.upload.create({
    data: {
      id: input.id,
      eventId: input.eventId,
      originalFilename: input.originalFilename,
      storageKeyOriginal: input.storageKeyOriginal,
      mimeType: input.mimeType,
      mediaType: input.mediaType.toUpperCase() as "IMAGE" | "VIDEO",
      sizeBytes: input.sizeBytes,
      status: "PENDING",
    },
  })
}

export async function getUploadById(id: string) {
  return db.upload.findUnique({
    where: { id },
  })
}

export async function markUploadUploaded(input: {
  id: string
  storageKeyOptimized?: string | null
  storageKeyThumbnail?: string | null
}) {
  return db.upload.update({
    where: { id: input.id },
    data: {
      status: "UPLOADED",
      storageKeyOptimized: input.storageKeyOptimized ?? null,
      storageKeyThumbnail: input.storageKeyThumbnail ?? null,
      uploadedAt: new Date(),
    },
  })
}

export async function markUploadProcessed(input: {
  id: string
  storageKeyOptimized: string
  storageKeyThumbnail: string
  width?: number | null
  height?: number | null
}) {
  return db.upload.update({
    where: { id: input.id },
    data: {
      status: "PROCESSED",
      storageKeyOptimized: input.storageKeyOptimized,
      storageKeyThumbnail: input.storageKeyThumbnail,
      width: input.width ?? null,
      height: input.height ?? null,
      uploadedAt: new Date(),
    },
  })
}

export async function markUploadFailed(id: string) {
  return db.upload.update({
    where: { id },
    data: {
      status: "FAILED",
    },
  })
}

export async function updateEventStorageUsedMb(eventId: string) {
  const aggregate = await db.upload.aggregate({
    where: {
      eventId,
      deletedAt: null,
      status: {
        in: ["UPLOADED", "PROCESSED"],
      },
    },
    _sum: {
      sizeBytes: true,
    },
  })

  const totalBytes = aggregate._sum.sizeBytes ?? 0
  const storageUsedMb = Math.ceil(totalBytes / (1024 * 1024))

  await db.event.update({
    where: { id: eventId },
    data: { storageUsedMb },
  })

  return storageUsedMb
}

export async function softDeleteUpload(id: string) {
  return db.upload.update({
    where: { id },
    data: {
      status: "DELETED",
      deletedAt: new Date(),
    },
  })
}
