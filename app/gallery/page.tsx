import { ImageGrid, EmptyState } from "@/components/gallery"
import { Navbar, Footer } from "@/components/layout"
import type { GalleryImage } from "@/components/gallery"
import { Camera } from "lucide-react"

interface GalleryPageProps {
  eventName: string
  eventDate: string
  images: GalleryImage[]
}

export default function GalleryPage() {
  // Dummy data for preview - will come from API in production
  const galleryData: GalleryPageProps = {
    eventName: "Ana & Marko",
    eventDate: "15 Јуни 2025",
    images: [
      { id: "1", url: "https://picsum.photos/seed/wed1/800/600", thumbnailUrl: "https://picsum.photos/seed/wed1/400/300", uploadedAt: "2025-06-15T14:30:00Z" },
      { id: "2", url: "https://picsum.photos/seed/wed2/800/1000", thumbnailUrl: "https://picsum.photos/seed/wed2/400/500", uploadedAt: "2025-06-15T14:35:00Z" },
      { id: "3", url: "https://picsum.photos/seed/wed3/800/800", thumbnailUrl: "https://picsum.photos/seed/wed3/400/400", uploadedAt: "2025-06-15T14:40:00Z" },
      { id: "4", url: "https://picsum.photos/seed/wed4/800/600", thumbnailUrl: "https://picsum.photos/seed/wed4/400/300", uploadedAt: "2025-06-15T15:00:00Z" },
      { id: "5", url: "https://picsum.photos/seed/wed5/800/1200", thumbnailUrl: "https://picsum.photos/seed/wed5/400/600", uploadedAt: "2025-06-15T15:10:00Z" },
      { id: "6", url: "https://picsum.photos/seed/wed6/800/600", thumbnailUrl: "https://picsum.photos/seed/wed6/400/300", uploadedAt: "2025-06-15T15:20:00Z" },
      { id: "7", url: "https://picsum.photos/seed/wed7/800/800", thumbnailUrl: "https://picsum.photos/seed/wed7/400/400", uploadedAt: "2025-06-15T15:25:00Z" },
      { id: "8", url: "https://picsum.photos/seed/wed8/800/600", thumbnailUrl: "https://picsum.photos/seed/wed8/400/300", uploadedAt: "2025-06-15T15:30:00Z" },
      { id: "9", url: "https://picsum.photos/seed/wed9/800/1000", thumbnailUrl: "https://picsum.photos/seed/wed9/400/500", uploadedAt: "2025-06-15T15:35:00Z" },
      { id: "10", url: "https://picsum.photos/seed/wed10/800/600", thumbnailUrl: "https://picsum.photos/seed/wed10/400/300", uploadedAt: "2025-06-15T15:40:00Z" },
      { id: "11", url: "https://picsum.photos/seed/wed11/800/800", thumbnailUrl: "https://picsum.photos/seed/wed11/400/400", uploadedAt: "2025-06-15T15:45:00Z" },
      { id: "12", url: "https://picsum.photos/seed/wed12/800/600", thumbnailUrl: "https://picsum.photos/seed/wed12/400/300", uploadedAt: "2025-06-15T15:50:00Z" },
    ],
  }

  const hasImages = galleryData.images.length > 0
  const photoCount = galleryData.images.length

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar eventName={galleryData.eventName} showAdminLink />

      {/* Gallery Header */}
      <header className="border-b border-border bg-muted/30 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Галерија
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            {galleryData.eventName} - {galleryData.eventDate}
          </p>
          {hasImages && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Camera className="h-4 w-4" />
              {photoCount} {photoCount === 1 ? "фотографија" : "фотографии"}
            </div>
          )}
        </div>
      </header>

      {/* Gallery Content */}
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          {hasImages ? (
            <ImageGrid images={galleryData.images} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      <Footer eventName={galleryData.eventName} eventDate={galleryData.eventDate} />
    </div>
  )
}
