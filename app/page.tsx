import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <main className="w-full max-w-md md:max-w-2xl space-y-6">
        {/* Design System Preview - Step 1 Complete */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              Wedding QR Platform
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Design System Setup Complete
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color Preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Colors:</p>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary" title="Primary (gray-900)" />
                <div className="h-8 w-8 rounded-xl bg-secondary border" title="Secondary (gray-100)" />
                <div className="h-8 w-8 rounded-xl bg-accent" title="Accent (beige)" />
                <div className="h-8 w-8 rounded-xl bg-destructive" title="Error (red-500)" />
                <div className="h-8 w-8 rounded-xl bg-success" title="Success (green-500)" />
              </div>
            </div>

            {/* Button Variants */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Button Variants:</p>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-xl">Primary</Button>
                <Button variant="secondary" className="rounded-xl">Secondary</Button>
                <Button variant="destructive" className="rounded-xl">Danger</Button>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Typography:</p>
              <h2 className="text-2xl font-semibold">Title (text-2xl)</h2>
              <p className="text-base">Body text (text-base)</p>
              <p className="text-sm text-muted-foreground">Small muted text (text-sm)</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
