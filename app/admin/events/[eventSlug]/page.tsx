import { notFound } from "next/navigation"

import { AdminEventShell } from "@/components/admin"
import { getAdminEventBySlug } from "@/lib/events"
import { getSignedReadUrl } from "@/lib/r2"
import { getUploadsForEvent } from "@/lib/uploads"
import { eventSlugSchema } from "@/lib/validation"

type AdminUploadRecord = Awaited<ReturnType<typeof getUploadsForEvent>>[number]

interface AdminEventPageProps {
  params: Promise<{
    eventSlug: string
  }>
}

export default async function AdminEventPage({ params }: AdminEventPageProps) {
  const { eventSlug } = await params
  const parsedSlug = eventSlugSchema.safeParse(eventSlug)

  if (!parsedSlug.success) {
    notFound()
  }

  const event = await getAdminEventBySlug(parsedSlug.data)

  if (!event) {
    notFound()
  }

  const uploads = await getUploadsForEvent(event.id)
  const hydratedUploads = await Promise.all(
    uploads.map(async (upload: AdminUploadRecord) => ({
      id: upload.id,
      url: await getSignedReadUrl(upload.storageKeyOriginal),
      thumbnailUrl: upload.storageKeyThumbnail
        ? await getSignedReadUrl(upload.storageKeyThumbnail)
        : upload.storageKeyOptimized
          ? await getSignedReadUrl(upload.storageKeyOptimized)
          : await getSignedReadUrl(upload.storageKeyOriginal),
      type: upload.mediaType.toLowerCase() as "image" | "video",
      size: upload.sizeBytes,
      uploadedAt: upload.uploadedAt.toISOString(),
      filename: upload.originalFilename,
    }))
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminEventShell
        event={{
          slug: event.slug,
          name: event.name,
          maxStorageMb: event.maxStorageMb,
          storageUsedMb: event.storageUsedMb,
        }}
        initialUploads={hydratedUploads}
      />
    </div>
  )
}
