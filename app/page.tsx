import { Header, EventInfo } from "@/components/event"

interface EventPageProps {
  eventName: string
  eventDate: string
  eventLocation?: string
}

export default function Home() {
  // Props will come from API - placeholder for now
  const eventData: EventPageProps = {
    eventName: "",
    eventDate: "",
    eventLocation: "",
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

        {/* Upload Section placeholder - Next Step */}
        <div className="rounded-xl border border-dashed border-muted-foreground/30 p-8">
          <p className="text-sm text-muted-foreground">
            Upload Section - Coming in Step 3
          </p>
        </div>
      </main>
    </div>
  )
}
