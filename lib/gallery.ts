import "server-only"

import { getEventBySlug } from "@/lib/events"
import { formatEventDate } from "@/lib/format"
import { getSignedReadUrl } from "@/lib/r2"
import { getGalleryUploadsForEvent } from "@/lib/uploads"

export async function getGalleryDataByEventSlug(eventSlug: string) {
  const event = await getEventBySlug(eventSlug)

  if (!event) {
    return null
  }

  const uploads = await getGalleryUploadsForEvent(event.id)
  const images = await Promise.all(
    uploads.map(async (upload) => ({
      id: upload.id,
      url: upload.storageKeyOptimized
        ? await getSignedReadUrl(upload.storageKeyOptimized)
        : await getSignedReadUrl(upload.storageKeyOriginal),
      thumbnailUrl: upload.storageKeyThumbnail
        ? await getSignedReadUrl(upload.storageKeyThumbnail)
        : upload.storageKeyOptimized
          ? await getSignedReadUrl(upload.storageKeyOptimized)
          : await getSignedReadUrl(upload.storageKeyOriginal),
      type: upload.mediaType.toLowerCase() as "image" | "video",
      uploadedAt: upload.uploadedAt.toISOString(),
    }))
  )

  return {
    event: {
      id: event.id,
      slug: event.slug,
      name: event.name,
      eventDate: formatEventDate(event.eventDate?.toISOString() ?? null),
      allowGallery: event.allowGallery,
    },
    images,
  }
}
