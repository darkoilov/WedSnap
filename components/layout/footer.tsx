import { Heart, Camera } from "lucide-react"

interface FooterProps {
  eventName?: string
  eventDate?: string
}

export function Footer({ eventName, eventDate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Event Info */}
          {eventName && (
            <div className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Heart className="h-5 w-5 text-destructive" fill="currentColor" />
              <span>{eventName}</span>
              <Heart className="h-5 w-5 text-destructive" fill="currentColor" />
            </div>
          )}
          
          {eventDate && (
            <p className="text-sm text-muted-foreground">{eventDate}</p>
          )}

          {/* Branding */}
          <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
            <Camera className="h-4 w-4" />
            <span>Powered by WedSnap</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} WedSnap. Сите права задржани.
          </p>
        </div>
      </div>
    </footer>
  )
}
