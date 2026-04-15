import { EventClosedPage } from "@/components/error"

interface ClosedPageProps {
  searchParams: Promise<{
    event?: string
  }>
}

export default async function ClosedEventPage({ searchParams }: ClosedPageProps) {
  const params = await searchParams
  const eventName = params.event

  return (
    <EventClosedPage
      eventName={eventName}
      message="Овој настан е затворен"
    />
  )
}
