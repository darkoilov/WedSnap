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
  // Props will come from API - placeholder for now
  const eventData: EventPageProps = {
    eventName: "",
    eventDate: "",
    eventLocation: "",
    uploadEnabled: true,
    remainingStorageMb: 450,
    maxStorageMb: 500,
    eventStatus: "active",
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <main className="w-full max-w-md md:max-w-2xl space-y-6 text-center">
        {/* Header Component */}
        <Header eventName={eventData.eventName || "Event Name"} />

        {/* Event Info Component */}
        <EventInfo
          eventDate={eventData.eventDate || "Event Date"}
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
