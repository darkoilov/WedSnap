import { Header, EventInfo, UploadSection } from "@/components/event"
import type { EventStatus } from "@/components/event"

interface EventPageProps {
  eventName: string
  eventDate: string
  eventLocation?: string
  uploadEnabled: boolean
  remainingStorageMb: number
  maxStorageMb: number
  eventStatus: EventStatus
}

export default function Home() {
  // Dummy data for preview - will come from API in production
  const eventData: EventPageProps = {
    eventName: "Ana & Marko",
    eventDate: "15 Јуни 2025",
    eventLocation: "Скопје, Македонија",
    uploadEnabled: true,
    remainingStorageMb: 320,
    maxStorageMb: 500,
    eventStatus: "active",
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <main className="w-full max-w-md md:max-w-2xl space-y-6 text-center">
        {/* Header Component */}
        <Header eventName={eventData.eventName} />

        {/* Event Info Component */}
        <EventInfo
          eventDate={eventData.eventDate}
          eventLocation={eventData.eventLocation}
        />

        {/* Upload Section Component */}
        <UploadSection
          uploadEnabled={eventData.uploadEnabled}
          remainingStorageMb={eventData.remainingStorageMb}
          maxStorageMb={eventData.maxStorageMb}
          eventStatus={eventData.eventStatus}
        />
      </main>
    </div>
  )
}
