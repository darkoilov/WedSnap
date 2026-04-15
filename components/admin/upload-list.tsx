"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Download, Video, ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

export interface Upload {
  id: string
  url: string
  thumbnailUrl?: string
  type: "image" | "video"
  size: number
  uploadedAt: string
}

interface UploadListProps {
  uploads: Upload[]
  onDelete?: (id: string) => Promise<void>
  onDownload?: (id: string, url: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDate(dateString: string): string {
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
    } else {
      window.open(url, "_blank")
    }
  }

  if (uploads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Нема прикачени фајлови</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {uploads.map((upload) => (
        <Card key={upload.id} className="overflow-hidden">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-muted">
            {upload.type === "video" ? (
              <div className="flex h-full items-center justify-center">
                <Video className="h-10 w-10 text-muted-foreground" />
              </div>
            ) : (
              <Image
                src={upload.thumbnailUrl || upload.url}
                alt="Upload thumbnail"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>

          {/* Details */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {upload.type === "video" ? "Видео" : "Слика"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(upload.size)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(upload.uploadedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(upload.id, upload.url)}
                  title="Преземи"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Преземи</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={deletingId === upload.id}
                      title="Избриши"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Избриши</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Избриши фајл
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Дали сте сигурни дека сакате да го избришете овој фајл?
                        Оваа акција не може да се поништи.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Откажи</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(upload.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Избриши
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
