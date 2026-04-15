"use client"

import { useEffect, useRef } from "react"
import { Download, Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface QRCodeDisplayProps {
  eventUrl: string
  eventName: string
  size?: number
}

export function QRCodeDisplay({ eventUrl, eventName, size = 200 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  // Generate QR code using canvas
  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return
      
      // Use QR code library dynamically
      const QRCode = (await import("qrcode")).default
      
      try {
        await QRCode.toCanvas(canvasRef.current, eventUrl, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        })
      } catch {
        console.error("Failed to generate QR code")
      }
    }

    generateQR()
  }, [eventUrl, size])

  const handleDownload = () => {
    if (!canvasRef.current) return
    
    const link = document.createElement("a")
    link.download = `${eventName.replace(/\s+/g, "-").toLowerCase()}-qr.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName,
          text: `Сподели ги твоите фотографии од ${eventName}`,
          url: eventUrl,
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Сподели го настанот</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* QR Code */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <canvas ref={canvasRef} className="h-auto w-full max-w-[200px]" />
        </div>

        {/* Event URL */}
        <div className="w-full rounded-lg bg-muted p-3 text-center">
          <p className="truncate text-sm text-muted-foreground">{eventUrl}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid w-full grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload} className="flex-col gap-1 py-4">
            <Download className="h-4 w-4" />
            <span className="text-xs">Преземи</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-col gap-1 py-4">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            <span className="text-xs">{copied ? "Копирано" : "Копирај"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="flex-col gap-1 py-4">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Сподели</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
