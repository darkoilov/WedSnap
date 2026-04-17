import { z } from "zod"

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const

export const VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime"] as const

export const eventSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid event slug format")

export const uploadInitSchema = z.object({
  eventSlug: eventSlugSchema,
  fileName: z.string().trim().min(1).max(255),
  fileType: z
    .string()
    .refine(
      (value) =>
        IMAGE_MIME_TYPES.includes(value as (typeof IMAGE_MIME_TYPES)[number]) ||
        VIDEO_MIME_TYPES.includes(value as (typeof VIDEO_MIME_TYPES)[number]),
      "Unsupported file type"
    ),
  fileSize: z.number().int().positive(),
})

export const uploadCompleteSchema = z.object({
  uploadId: z.string().trim().min(1),
  eventSlug: eventSlugSchema,
})

export const deleteUploadSchema = z.object({
  uploadId: z.string().trim().min(1),
})

export function getMediaTypeFromMimeType(mimeType: string) {
  return mimeType.startsWith("video/") ? "video" : "image"
}

export function isAllowedUploadMimeType(mimeType: string) {
  return (
    IMAGE_MIME_TYPES.includes(mimeType as (typeof IMAGE_MIME_TYPES)[number]) ||
    VIDEO_MIME_TYPES.includes(mimeType as (typeof VIDEO_MIME_TYPES)[number])
  )
}
