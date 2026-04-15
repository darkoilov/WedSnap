"use client"

import Image from "next/image"
import { Calendar, MapPin, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  eventName: string
  eventDate: string
  eventLocation?: string
  coverImageUrl?: string
  onUploadClick?: () => void
}

export function HeroSection({
  eventName,
  eventDate,
  eventLocation,
  coverImageUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
  onUploadClick,
}: HeroSectionProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden md:h-[70vh]">
      {/* Background Image */}
      <Image
        src={coverImageUrl}
        alt={eventName}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-6 pb-12 text-center text-white md:pb-16">
        {/* Event Name */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
          {eventName}
        </h1>

        {/* Event Details */}
        <div className="mb-6 flex flex-col items-center gap-3 md:flex-row md:gap-6">
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="h-5 w-5" />
            <span className="text-lg">{eventDate}</span>
          </div>
          {eventLocation && (
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{eventLocation}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        {onUploadClick && (
          <Button
            size="lg"
            onClick={onUploadClick}
            className="gap-2 bg-white text-black hover:bg-white/90"
          >
            <Camera className="h-5 w-5" />
            Сподели фотографии
          </Button>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-white/50 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  )
}
