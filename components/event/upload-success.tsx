"use client"

import { CheckCircle, Images, Upload, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface UploadSuccessProps {
  uploadCount: number
  onUploadMore: () => void
  galleryUrl?: string
}

export function UploadSuccess({ uploadCount, onUploadMore, galleryUrl = "/gallery" }: UploadSuccessProps) {
  return (
    <Card className="mx-auto w-full max-w-md border-success/20 bg-success/5">
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        {/* Success Animation */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <PartyPopper className="absolute -right-2 -top-2 h-8 w-8 text-yellow-500" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Успешно!
          </h2>
          <p className="text-muted-foreground">
            {uploadCount === 1 
              ? "Твојата фотографија е прикачена" 
              : `${uploadCount} фотографии се прикачени`
            }
          </p>
        </div>

        {/* Encouragement */}
        <p className="text-sm text-muted-foreground">
          Благодариме што ги споделуваш моментите!
        </p>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3">
          <Button onClick={onUploadMore} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            Прикачи уште
          </Button>
          <Button variant="outline" asChild className="w-full gap-2">
            <Link href={galleryUrl}>
              <Images className="h-4 w-4" />
              Види ја галеријата
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
