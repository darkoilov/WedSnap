"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GalleryImage } from "./image-grid"

interface ImageModalProps {
  image: GalleryImage | null
  onClose: () => void
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose]
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Close modal"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Image container */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {image.type === "video" ? (
          <video
            src={image.url}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw] rounded-xl"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={image.url}
            alt=""
            width={1200}
            height={800}
            className="max-h-[90vh] w-auto rounded-xl object-contain"
            priority
          />
        )}
      </div>
    </div>
  )
}
