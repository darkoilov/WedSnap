"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const pages = [
  {
    name: "Project Home",
    path: "/",
    description: "Foundation landing page for event-scoped routes",
  },
  {
    name: "Event Upload Page",
    path: "/e/demo-event",
    description: "Dynamic event route placeholder",
  },
  {
    name: "Event Gallery",
    path: "/e/demo-event/gallery",
    description: "Dynamic gallery route placeholder",
  },
  {
    name: "Event Admin",
    path: "/admin/events/demo-event",
    description: "Dynamic admin route placeholder",
  },
  {
    name: "Admin Index",
    path: "/admin",
    description: "Explains the new event-scoped admin path",
  },
  {
    name: "Gallery Index",
    path: "/gallery",
    description: "Explains the new event-scoped gallery path",
  },
  {
    name: "Error Page",
    path: "/error",
    description: "Invalid event error state",
  },
  {
    name: "Event Closed Page",
    path: "/closed",
    description: "Event closed state",
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <main className="mx-auto max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">WedSnap Demo</h1>
          <p className="text-muted-foreground">
            Navigate to different pages to preview the UI components
          </p>
        </div>

        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.path} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{page.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{page.description}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={page.path}>View</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Prototype pages now coexist with the event-scoped MVP route structure
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
