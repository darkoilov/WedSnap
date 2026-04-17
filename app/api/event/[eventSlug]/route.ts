import { NextResponse } from "next/server"

import { getEnv } from "@/lib/env"
import { getPublicEventBySlug, mapEventToPublicDto } from "@/lib/events"
import { eventSlugSchema } from "@/lib/validation"

interface RouteContext {
  params: Promise<{
    eventSlug: string
  }>
}

export async function GET(_: Request, { params }: RouteContext) {
  const resolvedParams = await params
  const parsedSlug = eventSlugSchema.safeParse(resolvedParams.eventSlug)

  if (!parsedSlug.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_EVENT_SLUG",
          message: "Invalid event slug.",
        },
      },
      { status: 400 }
    )
  }

  getEnv()

  const event = await getPublicEventBySlug(parsedSlug.data)

  if (!event) {
    return NextResponse.json(
      {
        error: {
          code: "EVENT_NOT_FOUND",
          message: "Event not found.",
        },
      },
      { status: 404 }
    )
  }

  return NextResponse.json(mapEventToPublicDto(event))
}
