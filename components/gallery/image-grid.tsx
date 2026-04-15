"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { ImageModal } from "./image-modal"

export interface GalleryImage {
  id: string
  url: string
  thumbnailUrl: string
  type: "image" | "video"
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

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Image
              src={image.thumbnailUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            {image.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                  <Play className="h-6 w-6 text-foreground" fill="currentColor" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}
