import { GallerySkeleton } from "@/components/gallery/gallery-skeleton"

export default function EventGalleryLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <GallerySkeleton />
    </main>
  )
}
