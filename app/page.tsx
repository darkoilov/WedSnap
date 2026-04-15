"use client"

import { useState, useRef } from "react"
import { HeroSection, UploadSection, UploadSuccess, QRCodeDisplay } from "@/components/event"
import { Navbar, Footer } from "@/components/layout"
import type { EventStatus } from "@/components/event"

interface EventPageProps {
  eventName: string
  eventDate: string
  eventLocation?: string
  coverImageUrl?: string
  uploadEnabled: boolean
  remainingStorageMb: number
  maxStorageMb: number
  eventStatus: EventStatus
}

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const uploadRef = useRef<HTMLDivElement>(null)

  // Dummy data for preview - will come from API in production
  const eventData: EventPageProps = {
    eventName: "Ana & Marko",
    eventDate: "15 Јуни 2025",
    eventLocation: "Скопје, Македонија",
    coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
    uploadEnabled: true,
    remainingStorageMb: 320,
    maxStorageMb: 500,
    eventStatus: "active",
  }

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUploadComplete = (count: number) => {
    setUploadCount(count)
    setShowSuccess(true)
  }

  const handleUploadMore = () => {
    setShowSuccess(false)
    setUploadCount(0)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar eventName={eventData.eventName} showAdminLink />

      {/* Hero Section */}
      <HeroSection
        eventName={eventData.eventName}
        eventDate={eventData.eventDate}
        eventLocation={eventData.eventLocation}
        coverImageUrl={eventData.coverImageUrl}
        onUploadClick={scrollToUpload}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Upload Section */}
          <section ref={uploadRef} className="scroll-mt-20">
            <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
              Сподели ги твоите моменти
            </h2>
            
            {showSuccess ? (
              <UploadSuccess 
                uploadCount={uploadCount} 
                onUploadMore={handleUploadMore}
              />
            ) : (
              <div className="mx-auto max-w-md">
                <UploadSection
                  uploadEnabled={eventData.uploadEnabled}
                  remainingStorageMb={eventData.remainingStorageMb}
                  maxStorageMb={eventData.maxStorageMb}
                  eventStatus={eventData.eventStatus}
                />
              </div>
            )}
          </section>

          {/* QR Code Section */}
          <section className="border-t border-border pt-12">
            <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
              Покани ги гостите
            </h2>
            <QRCodeDisplay 
              eventUrl="https://wedsnap.app/e/ana-marko"
              eventName={eventData.eventName}
            />
          </section>
        </div>
      </main>

      <Footer eventName={eventData.eventName} eventDate={eventData.eventDate} />
    </div>
  )
}
