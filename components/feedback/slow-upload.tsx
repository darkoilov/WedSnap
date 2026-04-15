"use client"

import { Loader2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SlowUploadProps {
  progress: number
  fileName?: string
  estimatedTimeSeconds?: number
}

export function SlowUpload({
  progress,
  fileName,
  estimatedTimeSeconds,
}: SlowUploadProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} сек`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} мин ${remainingSeconds} сек`
  }

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">Се прикачува...</p>
          {fileName && (
            <p className="truncate text-sm text-muted-foreground">{fileName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-3 rounded-full" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{progress}%</span>
          {estimatedTimeSeconds !== undefined && estimatedTimeSeconds > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatTime(estimatedTimeSeconds)}
            </span>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Молиме почекајте, прикачувањето може да потрае
      </p>
    </div>
  )
}
