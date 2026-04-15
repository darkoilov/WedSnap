import { Header } from "@/components/event"
import { ImageGrid, EmptyState } from "@/components/gallery"
import type { GalleryImage } from "@/components/gallery"

interface GalleryPageProps {
  eventName: string
  images: GalleryImage[]
}

export default function GalleryPage() {
  // Props will come from API - placeholder for now
  const galleryData: GalleryPageProps = {
    eventName: "",
    images: [], // Will be populated from API: GET /api/gallery/:slug
  }

  const hasImages = galleryData.images.length > 0

  return (
    <div className="min-h-screen p-4 md:p-6">
      <main className="mx-auto max-w-md space-y-6 md:max-w-4xl lg:max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <Header eventName={galleryData.eventName || "Event Gallery"} />
        </div>

        {/* Gallery Content */}
        {hasImages ? (
          <ImageGrid images={galleryData.images} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}
