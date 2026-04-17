"use client"

import * as React from "react"
import { AlertCircle, Camera, CheckCircle2, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export type UploadState = "idle" | "selected" | "uploading" | "success" | "error"

export type EventStatus = "active" | "full" | "closed"

interface SelectedFile {
  id: string
  file: File
  preview: string
}

interface UploadSectionProps {
  uploadEnabled: boolean
  remainingStorageMb: number
  maxStorageMb: number
  eventStatus: EventStatus
  onUpload?: (files: File[]) => Promise<void>
}

export function UploadSection({
  uploadEnabled,
  remainingStorageMb,
  maxStorageMb,
  eventStatus,
  onUpload,
}: UploadSectionProps) {
  const [uploadState, setUploadState] = React.useState<UploadState>("idle")
  const [selectedFiles, setSelectedFiles] = React.useState<SelectedFile[]>([])
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const isDisabled = !uploadEnabled || eventStatus === "full" || eventStatus === "closed"

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newFiles: SelectedFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }))

    setSelectedFiles((prev) => [...prev, ...newFiles])
    setUploadState("selected")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((file) => file.id !== id)
      const removed = prev.find((file) => file.id === id)

      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }

      if (updated.length === 0) {
        setUploadState("idle")
      }

      return updated
    })
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploadState("uploading")
    setUploadProgress(0)
    setErrorMessage("")

    let progressInterval: ReturnType<typeof setInterval> | null = null

    try {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            if (progressInterval) {
              clearInterval(progressInterval)
            }
            return prev
          }

          return prev + 10
        })
      }, 200)

      if (onUpload) {
        await onUpload(selectedFiles.map((entry) => entry.file))
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      if (progressInterval) {
        clearInterval(progressInterval)
      }

      setUploadProgress(100)
      selectedFiles.forEach((entry) => URL.revokeObjectURL(entry.preview))
      setSelectedFiles([])
      setUploadState("success")
    } catch (error) {
      if (progressInterval) {
        clearInterval(progressInterval)
      }

      setUploadState("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nastana greska. Obidi se povtorno."
      )
    }
  }

  const handleAddMore = () => {
    setUploadState("idle")
    setUploadProgress(0)
  }

  const handleRetry = () => {
    setUploadState("selected")
    setErrorMessage("")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const getDisabledMessage = () => {
    if (eventStatus === "full") return "Upload limitot e dostignat"
    if (eventStatus === "closed") return "Ovoj nastan e zatvoren"
    return ""
  }

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isDisabled || uploadState === "uploading"}
      />

      {isDisabled && (
        <div className="flex flex-col items-center space-y-4">
          <Button size="lg" className="w-full rounded-xl py-6 text-lg" disabled>
            <Camera className="mr-2 size-5" />
            Dodadi sliki
          </Button>
          <p className="text-sm text-muted-foreground">{getDisabledMessage()}</p>
        </div>
      )}

      {!isDisabled && uploadState === "idle" && (
        <div className="flex flex-col items-center space-y-4">
          <Button
            size="lg"
            className="w-full rounded-xl py-6 text-lg"
            onClick={triggerFileInput}
          >
            <Camera className="mr-2 size-5" />
            Dodadi sliki
          </Button>
          <p className="text-sm text-muted-foreground">
            Mozes da dodades povekje sliki odednas
          </p>
          <p className="text-sm text-muted-foreground">
            Ostanato: {remainingStorageMb} MB od {maxStorageMb} MB
          </p>
        </div>
      )}

      {!isDisabled && uploadState === "selected" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {selectedFiles.map((file) => (
              <div key={file.id} className="relative aspect-square">
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="size-full rounded-xl object-cover"
                />
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-md"
                  aria-label={`Remove ${file.file.name}`}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button
              onClick={triggerFileInput}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
              aria-label="Add more files"
            >
              <Camera className="size-8" />
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {selectedFiles.length} {selectedFiles.length === 1 ? "slika" : "sliki"} izbrani
          </p>

          <Button
            size="lg"
            className="w-full rounded-xl py-6 text-lg"
            onClick={handleUpload}
          >
            Prikaci
          </Button>
        </div>
      )}

      {!isDisabled && uploadState === "uploading" && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm font-medium">Se prikacuva...</span>
          </div>
          <div className="w-full space-y-2">
            <Progress value={uploadProgress} className="h-3 rounded-full" />
            <p className="text-center text-sm text-muted-foreground">
              {uploadProgress}%
            </p>
          </div>
          <Button size="lg" className="w-full rounded-xl py-6 text-lg" disabled>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Se prikacuva...
          </Button>
        </div>
      )}

      {!isDisabled && uploadState === "success" && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <p className="text-lg font-medium text-foreground">
            Slikite se uspesno prikaceni!
          </p>
          <Button
            size="lg"
            className="w-full rounded-xl py-6 text-lg"
            onClick={handleAddMore}
          >
            Dodadi uste
          </Button>
        </div>
      )}

      {!isDisabled && uploadState === "error" && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="size-10 text-destructive" />
          </div>
          <p className="text-center text-destructive">{errorMessage}</p>
          <Button
            size="lg"
            variant="destructive"
            className="w-full rounded-xl py-6 text-lg"
            onClick={handleRetry}
          >
            Obidi se povtorno
          </Button>
        </div>
      )}
    </div>
  )
}
