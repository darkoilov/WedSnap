import { ImageIcon } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-lg text-muted-foreground">
        {"Сѐ уште нема слики"}
      </p>
    </div>
  )
}
