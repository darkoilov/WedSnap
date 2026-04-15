"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GalleryImage } from "./image-grid"

interface ImageModalProps {
  image: GalleryImage | null
  images: GalleryImage[]
  onClose: () => void
  onNavigate: (image: GalleryImage) => void
}

export function ImageModal({ image, images, onClose, onNavigate }: ImageModalProps) {
  const currentIndex = image ? images.findIndex(img => img.id === image.id) : -1
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      onNavigate(images[currentIndex - 1])
    }
  }, [hasPrevious, currentIndex, images, onNavigate])

  const goToNext = useCallback(() => {
    if (hasNext) {
      onNavigate(images[currentIndex + 1])
    }
  }, [hasNext, currentIndex, images, onNavigate])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    },
    [onClose, goToPrevious, goToNext]
  )

  useEffect(() => {
    if (image) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [image, handleKeyDown])

  if (!image) return null

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `wedsnap-${image.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      window.open(image.url, "_blank")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
        <span className="text-sm text-white/70">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={handleDownload}
            aria-label="Преземи слика"
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Затвори"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Previous button */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={goToPrevious}
          aria-label="Претходна слика"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {/* Next button */}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={goToNext}
          aria-label="Следна слика"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Image container */}
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {image.type === "video" ? (
          <video
            src={image.url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-xl"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={image.url}
            alt=""
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto rounded-xl object-contain"
            priority
          />
        )}
      </div>

      {/* Click to close overlay */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onNavigate(img)}
              className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                idx === currentIndex 
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black" 
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={img.thumbnailUrl}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
