"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Play } from "lucide-react"

import { useFavorites } from "@/components/providers/favorites-provider"
import { cn } from "@/lib/utils"

import { ImageModal } from "./image-modal"
import { MediaTabs, type LayoutMode, type MediaFilter } from "./media-tabs"

export interface GalleryImage {
  id: string
  url: string
  thumbnailUrl: string
  type?: "image" | "video"
  duration?: string
  uploadedAt: string
}

interface ImageGridProps {
  images: GalleryImage[]
  showTabs?: boolean
}

export function ImageGrid({ images, showTabs = true }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [filter, setFilter] = useState<MediaFilter>("all")
  const [layout, setLayout] = useState<LayoutMode>("masonry")
  const { favorites, favoritesCount, toggleFavorite } = useFavorites()

  if (images.length === 0) {
    return null
  }

  const normalizedImages = images.map((image) => ({
    ...image,
    type: image.type ?? "image",
  }))

  const imageCount = normalizedImages.filter((image) => image.type === "image").length
  const videoCount = normalizedImages.filter((image) => image.type === "video").length

  const filteredImages = normalizedImages.filter((image) => {
    if (filter === "all") return true
    if (filter === "images") return image.type === "image"
    if (filter === "videos") return image.type === "video"
    if (filter === "favorites") return favorites.has(image.id)
    return true
  })

  return (
    <div className="space-y-6">
      {showTabs && (
        <MediaTabs
          imageCount={imageCount}
          videoCount={videoCount}
          favoritesCount={favoritesCount}
          activeFilter={filter}
          onFilterChange={setFilter}
          layoutMode={layout}
          onLayoutChange={setLayout}
        />
      )}

      {layout === "masonry" ? (
        <div className="columns-2 gap-3 space-y-3 sm:columns-3 md:gap-4 md:space-y-4 lg:columns-4">
          {filteredImages.map((image, index) => {
            const aspectClass =
              index % 5 === 0
                ? "aspect-[3/4]"
                : index % 3 === 0
                  ? "aspect-square"
                  : "aspect-[4/3]"

            return (
              <MediaCard
                key={image.id}
                image={image}
                aspectClass={aspectClass}
                isFavorite={favorites.has(image.id)}
                onToggleFavorite={() => toggleFavorite(image.id)}
                onClick={() => setSelectedImage(image)}
              />
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filteredImages.map((image) => (
            <MediaCard
              key={image.id}
              image={image}
              aspectClass="aspect-square"
              isFavorite={favorites.has(image.id)}
              onToggleFavorite={() => toggleFavorite(image.id)}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {filter === "favorites"
              ? "Nema omileni sliki"
              : filter === "videos"
                ? "Nema prikaceni videa"
                : "Nema prikaceni sliki"}
          </p>
        </div>
      )}

      <ImageModal
        image={selectedImage}
        images={filteredImages}
        onClose={() => setSelectedImage(null)}
        onNavigate={setSelectedImage}
      />
    </div>
  )
}

interface MediaCardProps {
  image: GalleryImage
  aspectClass: string
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

function MediaCard({
  image,
  aspectClass,
  onClick,
  isFavorite,
  onToggleFavorite,
}: MediaCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl bg-muted break-inside-avoid",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "transition-shadow hover:shadow-lg",
        aspectClass
      )}
    >
      <Image
        src={image.thumbnailUrl}
        alt=""
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onToggleFavorite()
        }}
        className="absolute right-2 top-2 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
      >
        <Heart
          className={cn("h-4 w-4", isFavorite && "fill-current text-red-400")}
        />
      </button>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {image.type === "video" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 text-white" fill="currentColor" />
            </div>
          </div>
          {image.duration && (
            <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
              {image.duration}
            </div>
          )}
        </>
      )}
    </button>
  )
}
