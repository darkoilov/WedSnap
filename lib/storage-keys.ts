function sanitizeFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

export function buildOriginalStorageKey(input: {
  eventId: string
  uploadId: string
  filename: string
}) {
  const safeFilename = sanitizeFilename(input.filename)
  return `events/${input.eventId}/originals/${input.uploadId}-${safeFilename}`
}

export function buildOptimizedStorageKey(input: {
  eventId: string
  uploadId: string
}) {
  return `events/${input.eventId}/optimized/${input.uploadId}.webp`
}

export function buildThumbnailStorageKey(input: {
  eventId: string
  uploadId: string
}) {
  return `events/${input.eventId}/thumbnails/${input.uploadId}.webp`
}

export { sanitizeFilename }
