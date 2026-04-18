import { Camera } from "lucide-react"
import { notFound } from "next/navigation"

import { EmptyState, ImageGrid } from "@/components/gallery"
import { Footer, Navbar } from "@/components/layout"
import { getGalleryDataByEventSlug } from "@/lib/gallery"
import { eventSlugSchema } from "@/lib/validation"

interface EventGalleryPageProps {
  params: Promise<{
    eventSlug: string
  }>
}

export default async function EventGalleryPage({
  params,
}: EventGalleryPageProps) {
  const { eventSlug } = await params
  const parsedSlug = eventSlugSchema.safeParse(eventSlug)

  if (!parsedSlug.success) {
    notFound()
  }

  const galleryData = await getGalleryDataByEventSlug(parsedSlug.data)

  if (!galleryData) {
    notFound()
  }

  const { event, images } = galleryData

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar eventName={event.name} eventSlug={event.slug} showAdminLink />

      <header className="border-b border-border bg-muted/30 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Gallery
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            {event.name}
            {event.eventDate ? ` | ${event.eventDate}` : ""}
          </p>
          {event.allowGallery ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Camera className="h-4 w-4" />
              {images.length} {images.length === 1 ? "image" : "images"}
            </div>
          ) : (
            <div className="inline-flex rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
              Gallery is disabled for this event
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          {!event.allowGallery ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-base text-muted-foreground">
                The event owner has disabled the public gallery.
              </p>
            </div>
          ) : images.length > 0 ? (
            <ImageGrid images={images} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      <Footer eventName={event.name} eventDate={event.eventDate ?? undefined} />
    </div>
  )
}
