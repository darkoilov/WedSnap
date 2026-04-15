"use client"

import { FileWarning, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileTooLargeProps {
  fileName: string
  fileSize: number
  maxSizeMb: number
  onDismiss?: () => void
}

export function FileTooLarge({
  fileName,
  fileSize,
  maxSizeMb,
  onDismiss,
}: FileTooLargeProps) {
  const fileSizeMb = (fileSize / (1024 * 1024)).toFixed(2)

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <FileWarning className="size-5 text-destructive" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-destructive">Фајлот е преголем</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {fileName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {fileSizeMb} MB / максимум {maxSizeMb} MB
          </p>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
