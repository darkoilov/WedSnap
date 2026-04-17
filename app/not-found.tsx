import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-6 py-12 text-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              WedSnap
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Event not found
            </h1>
            <p className="text-sm text-muted-foreground">
              The link you opened is invalid, expired, or the event is no longer available.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full max-w-xs">
            <Link href="/">Back to project home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
