import { Settings } from "lucide-react"

interface AdminHeaderProps {
  eventName: string
  totalUploads: number
  totalSizeMb: number
  maxSizeMb: number
}

export function AdminHeader({
  eventName,
  totalUploads,
  totalSizeMb,
  maxSizeMb,
}: AdminHeaderProps) {
  const usagePercent = Math.min((totalSizeMb / maxSizeMb) * 100, 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Админ панел</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            {eventName || "Настан"}
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="rounded-xl bg-muted px-4 py-2">
          <span className="text-muted-foreground">Вкупно фајлови: </span>
          <span className="font-medium">{totalUploads}</span>
        </div>
        <div className="rounded-xl bg-muted px-4 py-2">
          <span className="text-muted-foreground">Искористено: </span>
          <span className="font-medium">
            {totalSizeMb.toFixed(1)} MB / {maxSizeMb} MB
          </span>
        </div>
      </div>

      {/* Storage Progress */}
      <div className="space-y-1">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {usagePercent.toFixed(0)}% искористено
        </p>
      </div>
    </div>
  )
}
