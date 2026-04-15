"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorPageProps {
  title?: string
  message?: string
  onBack?: () => void
  backButtonText?: string
}

export function ErrorPage({
  title = "Настанот не постои",
  message = "Линкот што го отворивте е невалиден или настанот е избришан.",
  onBack,
  backButtonText = "Назад",
}: ErrorPageProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center space-y-6 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>

          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full max-w-xs"
          >
            {backButtonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
