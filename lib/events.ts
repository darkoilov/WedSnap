import "server-only"

import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"
import { getEnv } from "@/lib/env"

export const publicEventSelect = {
  id: true,
  slug: true,
  name: true,
  eventDate: true,
  location: true,
  status: true,
  allowGallery: true,
  allowVideos: true,
  maxStorageMb: true,
  maxFiles: true,
  storageUsedMb: true,
} satisfies Prisma.EventSelect

export const adminEventSelect = {
  ...publicEventSelect,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      uploads: true,
    },
  },
} satisfies Prisma.EventSelect

export async function getEventBySlug(slug: string) {
  getEnv()

  return db.event.findUnique({
    where: { slug },
  })
}

export async function getPublicEventBySlug(slug: string) {
  getEnv()

  return db.event.findUnique({
    where: { slug },
    select: publicEventSelect,
  })
}

export async function getAdminEventBySlug(slug: string) {
  getEnv()

  return db.event.findUnique({
    where: { slug },
    select: adminEventSelect,
  })
}

export function getRemainingStorageMb(event: {
  maxStorageMb: number
  storageUsedMb: number
}) {
  return Math.max(event.maxStorageMb - event.storageUsedMb, 0)
}

export function isEventUploadOpen(event: {
  status: "active" | "full" | "closed"
}) {
  return event.status === "active"
}

export function mapDbEventStatus(status: "ACTIVE" | "FULL" | "CLOSED") {
  return status.toLowerCase() as "active" | "full" | "closed"
}

export function mapEventToPublicDto(
  event: Prisma.EventGetPayload<{ select: typeof publicEventSelect }>
) {
  return {
    id: event.id,
    slug: event.slug,
    name: event.name,
    eventDate: event.eventDate?.toISOString() ?? null,
    location: event.location,
    status: mapDbEventStatus(event.status),
    allowGallery: event.allowGallery,
    allowVideos: event.allowVideos,
    maxStorageMb: event.maxStorageMb,
    maxFiles: event.maxFiles,
    storageUsedMb: event.storageUsedMb,
    remainingStorageMb: getRemainingStorageMb(event),
  }
}
