interface EventInfoProps {
  eventDate: string
  eventLocation?: string
}

export function EventInfo({ eventDate, eventLocation }: EventInfoProps) {
  return (
    <div className="text-center space-y-1">
      <p className="text-sm text-muted-foreground">{eventDate}</p>
      {eventLocation && (
        <p className="text-sm text-muted-foreground">{eventLocation}</p>
      )}
    </div>
  )
}
