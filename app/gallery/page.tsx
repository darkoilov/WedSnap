import { Header } from "@/components/event"
import { ImageGrid, EmptyState } from "@/components/gallery"
import type { GalleryImage } from "@/components/gallery"

interface GalleryPageProps {
  eventName: string
  images: GalleryImage[]
}

export default function GalleryPage() {
  // Dummy data for preview - will come from API in production
  const galleryData: GalleryPageProps = {
    eventName: "Ana & Marko - Галерија",
    images: [
      { id: "1", url: "https://picsum.photos/seed/wed1/400/300", thumbnailUrl: "https://picsum.photos/seed/wed1/200/150", uploadedAt: "2025-06-15T14:30:00Z" },
      { id: "2", url: "https://picsum.photos/seed/wed2/400/300", thumbnailUrl: "https://picsum.photos/seed/wed2/200/150", uploadedAt: "2025-06-15T14:35:00Z" },
      { id: "3", url: "https://picsum.photos/seed/wed3/400/300", thumbnailUrl: "https://picsum.photos/seed/wed3/200/150", uploadedAt: "2025-06-15T14:40:00Z" },
      { id: "4", url: "https://picsum.photos/seed/wed4/400/300", thumbnailUrl: "https://picsum.photos/seed/wed4/200/150", uploadedAt: "2025-06-15T15:00:00Z" },
      { id: "5", url: "https://picsum.photos/seed/wed5/400/300", thumbnailUrl: "https://picsum.photos/seed/wed5/200/150", uploadedAt: "2025-06-15T15:10:00Z" },
      { id: "6", url: "https://picsum.photos/seed/wed6/400/300", thumbnailUrl: "https://picsum.photos/seed/wed6/200/150", uploadedAt: "2025-06-15T15:20:00Z" },
    ],
  }

  const hasImages = galleryData.images.length > 0

  return (
    <div className="min-h-screen p-4 md:p-6">
      <main className="mx-auto max-w-md space-y-6 md:max-w-4xl lg:max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <Header eventName={galleryData.eventName} />
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
