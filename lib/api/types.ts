// API Response Types for Wedding Photo QR Platform

// Event Types
export interface Event {
  id: string
  slug: string
  name: string
  date: string
  location?: string
  status: "active" | "full" | "closed"
  maxStorageMb: number
  usedStorageMb: number
  remainingStorageMb: number
  createdAt: string
  updatedAt: string
}

// Upload Types
export interface UploadInitResponse {
  uploadId: string
  uploadUrl: string
  expiresAt: string
}

export interface UploadCompleteResponse {
  success: boolean
  fileId: string
  url: string
  thumbnailUrl: string
}

export interface UploadedFile {
  id: string
  url: string
  thumbnailUrl: string
  type: "image" | "video"
  size: number
  uploadedAt: string
}

// Gallery Types
export interface GalleryImage {
  id: string
  url: string
  thumbnailUrl: string
  type: "image" | "video"
  uploadedAt: string
}

export interface GalleryResponse {
  images: GalleryImage[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
}

// Admin Types
export interface AdminUpload {
  id: string
  url: string
  thumbnailUrl: string
  type: "image" | "video"
  size: number
  uploadedAt: string
  uploaderInfo?: {
    ip?: string
    userAgent?: string
  }
}

// API Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Common Response Wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}
