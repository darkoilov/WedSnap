"use client"

import { useState } from "react"
import Image from "next/image"
import { AlertCircle, Download, ImageIcon, Trash2, Video } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface Upload {
  id: string
  url: string
  thumbnailUrl?: string
  type: "image" | "video"
  size: number
  uploadedAt: string
  filename?: string
}

interface UploadListProps {
  uploads: Upload[]
  onDelete?: (id: string) => Promise<void>
  onDownload?: (id: string, url: string) => void
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(1))} ${units[index]}`
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString("mk-MK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function UploadList({ uploads, onDelete, onDownload }: UploadListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!onDelete) return

    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (id: string, url: string) => {
    if (onDownload) {
      onDownload(id, url)
      return
    }

    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (uploads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Nema prikaceni fajlovi</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {uploads.map((upload) => (
        <Card key={upload.id} className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            {upload.type === "video" ? (
              <div className="flex h-full items-center justify-center">
                <Video className="h-10 w-10 text-muted-foreground" />
              </div>
            ) : (
              <Image
                src={upload.thumbnailUrl || upload.url}
                alt={upload.filename || "Upload thumbnail"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {upload.filename || (upload.type === "video" ? "Video" : "Slika")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(upload.size)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(upload.uploadedAt)}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(upload.id, upload.url)}
                  title="Prezemi"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Prezemi</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={deletingId === upload.id}
                      title="Izbrisi"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Izbrisi</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Izbrisi fajl
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Dali ste sigurni deka sakate da go izbrisete ovoj fajl?
                        Ovaa akcija ne moze da se ponisti.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Otkazi</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(upload.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Izbrisi
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
