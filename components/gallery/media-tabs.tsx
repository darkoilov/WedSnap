"use client"

import { useState } from "react"
import { Image as ImageIcon, Video, Grid3X3, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

export type MediaFilter = "all" | "images" | "videos"
export type LayoutMode = "grid" | "masonry"

interface MediaTabsProps {
  imageCount: number
  videoCount: number
  activeFilter: MediaFilter
  onFilterChange: (filter: MediaFilter) => void
  layoutMode?: LayoutMode
  onLayoutChange?: (mode: LayoutMode) => void
}

export function MediaTabs({
  imageCount,
  videoCount,
  activeFilter,
  onFilterChange,
  layoutMode = "masonry",
  onLayoutChange,
}: MediaTabsProps) {
  const totalCount = imageCount + videoCount

  const tabs = [
    { id: "all" as const, label: "Сите", count: totalCount, icon: Grid3X3 },
    { id: "images" as const, label: "Слики", count: imageCount, icon: ImageIcon },
    { id: "videos" as const, label: "Видеа", count: videoCount, icon: Video },
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeFilter === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                activeFilter === tab.id
                  ? "bg-primary/10 text-primary"
                  : "bg-muted-foreground/10"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Layout toggle */}
      {onLayoutChange && (
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => onLayoutChange("masonry")}
            className={cn(
              "rounded-md p-2 transition-all",
              layoutMode === "masonry"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Masonry приказ"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onLayoutChange("grid")}
            className={cn(
              "rounded-md p-2 transition-all",
              layoutMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid приказ"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
