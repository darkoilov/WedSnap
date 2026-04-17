"use client"

import { useState } from "react"

import { UploadList, type Upload } from "@/components/admin"

import { AdminHeader } from "./admin-header"

interface AdminEventShellProps {
  event: {
    slug: string
    name: string
    maxStorageMb: number
    storageUsedMb: number
  }
  initialUploads: Upload[]
}

export function AdminEventShell({
  event,
  initialUploads,
}: AdminEventShellProps) {
  const [uploads, setUploads] = useState(initialUploads)
  const [storageUsedMb, setStorageUsedMb] = useState(event.storageUsedMb)

  const handleDelete = async (uploadId: string) => {
    const response = await fetch(`/api/admin/uploads/${uploadId}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventSlug: event.slug,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? "Delete failed.")
    }

    setUploads((prev) => prev.filter((upload) => upload.id !== uploadId))

    if (typeof payload.storageUsedMb === "number") {
      setStorageUsedMb(payload.storageUsedMb)
    }
  }

  const handleDownload = (_uploadId: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-12 md:px-6 md:py-16">
      <AdminHeader
        eventName={event.name}
        totalUploads={uploads.length}
        totalSizeMb={storageUsedMb}
        maxSizeMb={event.maxStorageMb}
      />

      <UploadList
        uploads={uploads}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />
    </main>
  )
}
