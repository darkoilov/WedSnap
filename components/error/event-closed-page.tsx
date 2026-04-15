"use client"

import { Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EventClosedPageProps {
  eventName?: string
  message?: string
}

export function EventClosedPage({
  eventName,
  message = "Овој настан е затворен",
}: EventClosedPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center space-y-6 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            {eventName && (
              <p className="text-sm text-muted-foreground">
                {eventName}
              </p>
            )}
            <h1 className="text-2xl font-semibold text-foreground">
              {message}
            </h1>
            <p className="text-sm text-muted-foreground">
              Прикачувањето слики за овој настан е оневозможено.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
