import { AdminHeader, UploadList } from "@/components/admin"
import type { Upload } from "@/components/admin"

interface AdminPageProps {
  eventName: string
  maxSizeMb: number
  uploads: Upload[]
}

export default function AdminPage() {
  // Dummy data for preview - will come from API in production
  const adminData: AdminPageProps = {
    eventName: "Ana & Marko",
    maxSizeMb: 500,
    uploads: [
      { id: "1", filename: "IMG_2847.jpg", size: 3.2 * 1024 * 1024, type: "image/jpeg", status: "completed", uploadedAt: "2025-06-15T14:30:00Z", url: "https://picsum.photos/seed/wed1/400/300" },
      { id: "2", filename: "IMG_2848.jpg", size: 2.8 * 1024 * 1024, type: "image/jpeg", status: "completed", uploadedAt: "2025-06-15T14:35:00Z", url: "https://picsum.photos/seed/wed2/400/300" },
      { id: "3", filename: "video_moment.mp4", size: 45.5 * 1024 * 1024, type: "video/mp4", status: "completed", uploadedAt: "2025-06-15T14:40:00Z", url: "#" },
      { id: "4", filename: "IMG_2850.jpg", size: 4.1 * 1024 * 1024, type: "image/jpeg", status: "completed", uploadedAt: "2025-06-15T15:00:00Z", url: "https://picsum.photos/seed/wed4/400/300" },
      { id: "5", filename: "DSC_0023.jpg", size: 5.2 * 1024 * 1024, type: "image/jpeg", status: "completed", uploadedAt: "2025-06-15T15:10:00Z", url: "https://picsum.photos/seed/wed5/400/300" },
    ],
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
          eventName={adminData.eventName}
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
