import type {
  Event,
  UploadInitResponse,
  UploadCompleteResponse,
  GalleryResponse,
  AdminUpload,
  ApiResponse,
} from "./types"

// API Base URL - replace with actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
    }))
    return { success: false, error }
  }
  const data = await response.json()
  return { success: true, data }
}

// GET /api/event/:slug
// Fetch event details by slug
export async function getEvent(slug: string): Promise<ApiResponse<Event>> {
  const response = await fetch(`${API_BASE_URL}/event/${slug}`)
  return handleResponse<Event>(response)
}

// POST /api/upload/init
// Initialize an upload session
export async function initUpload(
  eventId: string,
  fileInfo: {
    fileName: string
    fileSize: number
    mimeType: string
  }
): Promise<ApiResponse<UploadInitResponse>> {
  const response = await fetch(`${API_BASE_URL}/upload/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, ...fileInfo }),
  })
  return handleResponse<UploadInitResponse>(response)
}

// POST /api/upload/complete
// Complete an upload and process the file
export async function completeUpload(
  uploadId: string,
  eventId: string
): Promise<ApiResponse<UploadCompleteResponse>> {
  const response = await fetch(`${API_BASE_URL}/upload/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uploadId, eventId }),
  })
  return handleResponse<UploadCompleteResponse>(response)
}

// GET /api/gallery/:slug
// Fetch gallery images for an event
export async function getGallery(
  slug: string,
  options?: {
    cursor?: string
    limit?: number
  }
): Promise<ApiResponse<GalleryResponse>> {
  const params = new URLSearchParams()
  if (options?.cursor) params.set("cursor", options.cursor)
  if (options?.limit) params.set("limit", options.limit.toString())

  const queryString = params.toString()
  const url = `${API_BASE_URL}/gallery/${slug}${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url)
  return handleResponse<GalleryResponse>(response)
}

// Admin endpoints (would require authentication in production)

// GET /api/admin/uploads/:eventId
// Fetch all uploads for admin panel
export async function getAdminUploads(
  eventId: string
): Promise<ApiResponse<{ uploads: AdminUpload[] }>> {
  const response = await fetch(`${API_BASE_URL}/admin/uploads/${eventId}`)
  return handleResponse<{ uploads: AdminUpload[] }>(response)
}

// DELETE /api/admin/upload/:uploadId
// Delete an upload (admin only)
export async function deleteUpload(
  uploadId: string
): Promise<ApiResponse<{ success: boolean }>> {
  const response = await fetch(`${API_BASE_URL}/admin/upload/${uploadId}`, {
    method: "DELETE",
  })
  return handleResponse<{ success: boolean }>(response)
}

// GET /api/admin/upload/:uploadId/download
// Get download URL for an upload (admin only)
export async function getDownloadUrl(
  uploadId: string
): Promise<ApiResponse<{ downloadUrl: string }>> {
  const response = await fetch(`${API_BASE_URL}/admin/upload/${uploadId}/download`)
  return handleResponse<{ downloadUrl: string }>(response)
}
