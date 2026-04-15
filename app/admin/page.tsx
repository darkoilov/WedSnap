import { AdminHeader, UploadList } from "@/components/admin"
import type { Upload } from "@/components/admin"

interface AdminPageProps {
  eventName: string
  maxSizeMb: number
  uploads: Upload[]
}

export default function AdminPage() {
  // Props will come from API - placeholder for now
  const adminData: AdminPageProps = {
    eventName: "",
    maxSizeMb: 500,
    uploads: [],
  }

  // Calculate total size from uploads
  const totalSizeMb = adminData.uploads.reduce(
    (acc, upload) => acc + upload.size / (1024 * 1024),
    0
  )

  const handleDelete = async (id: string) => {
    // API call placeholder
    console.log("Delete upload:", id)
  }

  const handleDownload = (id: string, url: string) => {
    // Download logic placeholder
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <main className="mx-auto max-w-4xl space-y-6">
        <AdminHeader
          eventName={adminData.eventName || "Event Name"}
          totalUploads={adminData.uploads.length}
          totalSizeMb={totalSizeMb}
          maxSizeMb={adminData.maxSizeMb}
        />

        <UploadList
          uploads={adminData.uploads}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      </main>
    </div>
  )
}
