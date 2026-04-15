"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { ImageModal } from "./image-modal"

export interface GalleryImage {
  id: string
  url: string
  thumbnailUrl: string
  type?: "image" | "video"
  uploadedAt: string
}

interface ImageGridProps {
  images: GalleryImage[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  if (images.length === 0) {
    return null
  }

  // Normalize images to have type
  const normalizedImages = images.map(img => ({
    ...img,
    type: img.type || "image" as const
  }))

  return (
    <>
      {/* Masonry-style grid */}
      <div className="columns-2 gap-3 space-y-3 sm:columns-3 md:gap-4 md:space-y-4 lg:columns-4">
        {normalizedImages.map((image, index) => {
          // Vary aspect ratios for masonry effect
          const aspectClass = index % 5 === 0 
            ? "aspect-[3/4]" 
            : index % 3 === 0 
              ? "aspect-square" 
              : "aspect-[4/3]"
          
          return (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`group relative w-full overflow-hidden rounded-xl bg-muted break-inside-avoid focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${aspectClass}`}
            >
              <Image
                src={image.thumbnailUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              
              {image.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="h-7 w-7 text-white" fill="currentColor" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <ImageModal
        image={selectedImage}
        images={normalizedImages}
        onClose={() => setSelectedImage(null)}
        onNavigate={setSelectedImage}
      />
    </>
  )
}
