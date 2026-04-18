import { notFound } from "next/navigation"

import { EventPageShell } from "@/components/event"
import { getEnv } from "@/lib/env"
import { getPublicEventBySlug, mapEventToPublicDto } from "@/lib/events"
import { formatEventDate } from "@/lib/format"
import { eventSlugSchema } from "@/lib/validation"

interface EventPageProps {
  params: Promise<{
    eventSlug: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventSlug } = await params
  const parsedSlug = eventSlugSchema.safeParse(eventSlug)

  if (!parsedSlug.success) {
    notFound()
  }

  const event = await getPublicEventBySlug(parsedSlug.data)

  if (!event) {
    notFound()
  }

  const publicEvent = mapEventToPublicDto(event)
  const env = getEnv()

  return (
    <EventPageShell
      event={{
        slug: publicEvent.slug,
        name: publicEvent.name,
        eventDate: formatEventDate(publicEvent.eventDate),
        location: publicEvent.location,
        status: publicEvent.status,
        allowGallery: publicEvent.allowGallery,
        allowVideos: publicEvent.allowVideos,
        maxStorageMb: publicEvent.maxStorageMb,
        storageUsedMb: publicEvent.storageUsedMb,
      }}
      appBaseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  )
}
