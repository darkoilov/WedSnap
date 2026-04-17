"use client"

import Link from "next/link"
import { useRef, useState } from "react"

import { Footer, Navbar } from "@/components/layout"

import { HeroSection } from "./hero-section"
import { QRCodeDisplay } from "./qr-code-display"
import { UploadSection, type EventStatus } from "./upload-section"

interface EventPageShellProps {
  event: {
    slug: string
    name: string
    eventDate: string | null
    location: string | null
    status: EventStatus
    allowGallery: boolean
    maxStorageMb: number
    storageUsedMb: number
  }
  appBaseUrl: string
}

export function EventPageShell({ event, appBaseUrl }: EventPageShellProps) {
  const uploadRef = useRef<HTMLDivElement>(null)
  const [storageUsedMb, setStorageUsedMb] = useState(event.storageUsedMb)

  const remainingStorageMb = Math.max(event.maxStorageMb - storageUsedMb, 0)
  const eventUrl = `${appBaseUrl.replace(/\/$/, "")}/e/${event.slug}`

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      const initResponse = await fetch("/api/upload/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventSlug: event.slug,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      })

      const initPayload = await initResponse.json()
      if (!initResponse.ok) {
        throw new Error(initPayload?.error?.message ?? "Upload initialization failed.")
      }

      const uploadResponse = await fetch(initPayload.uploadUrl, {
        method: "PUT",
        headers: initPayload.headers,
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error("File upload failed while sending the file to storage.")
      }

      const completeResponse = await fetch("/api/upload/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadId: initPayload.uploadId,
          eventSlug: event.slug,
        }),
      })

      const completePayload = await completeResponse.json()
      if (!completeResponse.ok) {
        throw new Error(completePayload?.error?.message ?? "Upload completion failed.")
      }

      if (typeof completePayload.storageUsedMb === "number") {
        setStorageUsedMb(completePayload.storageUsedMb)
      }
    }
  }

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        eventName={event.name}
        eventSlug={event.slug}
        showAdminLink
      />

      <HeroSection
        eventName={event.name}
        eventDate={event.eventDate ?? "Date TBD"}
        eventLocation={event.location ?? undefined}
        onUploadClick={scrollToUpload}
      />

      <main className="flex-1 px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <section ref={uploadRef} className="scroll-mt-20">
            <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
              Share your wedding moments
            </h2>

            <div className="mx-auto max-w-md">
              <UploadSection
                uploadEnabled={event.status === "active"}
                remainingStorageMb={remainingStorageMb}
                maxStorageMb={event.maxStorageMb}
                eventStatus={event.status}
                onUpload={handleUpload}
              />
            </div>
          </section>

          {event.allowGallery && (
            <section className="space-y-4 border-t border-border pt-12 text-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Browse the gallery
              </h2>
              <p className="text-sm text-muted-foreground">
                View uploaded photos for this event.
              </p>
              <Link
                href={`/e/${event.slug}/gallery`}
                className="inline-flex rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Open gallery
              </Link>
            </section>
          )}

          <section className="border-t border-border pt-12">
            <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
              Share this event
            </h2>
            <QRCodeDisplay eventUrl={eventUrl} eventName={event.name} />
          </section>
        </div>
      </main>

      <Footer eventName={event.name} eventDate={event.eventDate ?? undefined} />
    </div>
  )
}
