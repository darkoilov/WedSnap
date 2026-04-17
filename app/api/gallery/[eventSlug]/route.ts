import { NextResponse } from "next/server"

import { getGalleryDataByEventSlug } from "@/lib/gallery"
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

  const galleryData = await getGalleryDataByEventSlug(parsedSlug.data)

  if (!galleryData) {
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

  if (!galleryData.event.allowGallery) {
    return NextResponse.json(
      {
        error: {
          code: "GALLERY_DISABLED",
          message: "Gallery is disabled for this event.",
        },
      },
      { status: 403 }
    )
  }

  return NextResponse.json({
    images: galleryData.images,
  })
}
