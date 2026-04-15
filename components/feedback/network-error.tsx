"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface NetworkErrorProps {
  onRetry?: () => void
  message?: string
}

export function NetworkError({
  onRetry,
  message = "Нема интернет конекција",
}: NetworkErrorProps) {
  return (
    <Card className="mx-auto max-w-md rounded-xl shadow-md">
      <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <WifiOff className="size-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">
          Провери ја интернет конекцијата и обиди се повторно
        </p>
        {onRetry && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 size-4" />
            Обиди се повторно
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
