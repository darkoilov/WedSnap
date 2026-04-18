import { describe, expect, it } from "vitest"

import { buildOriginalStorageKey } from "@/lib/storage-keys"
import {
  calculateStorageUsedMb,
  getUploadDeletionKeys,
  isGalleryEligibleUpload,
  isUploadOwnedByEvent,
  validateUploadInitRules,
} from "@/lib/upload-policies"

describe("event isolation", () => {
  it("namespaces original upload keys by event id", () => {
    const key = buildOriginalStorageKey({
      eventId: "evt_123",
      uploadId: "upl_456",
      filename: "Ana & Marko Wedding.JPG",
    })

    expect(key).toContain("events/evt_123/originals/")
    expect(key).toContain("upl_456-ana-marko-wedding.jpg")
  })

  it("checks that uploads belong to the expected event", () => {
    expect(
      isUploadOwnedByEvent({
        uploadEventId: "evt_a",
        eventId: "evt_a",
      })
    ).toBe(true)

    expect(
      isUploadOwnedByEvent({
        uploadEventId: "evt_a",
        eventId: "evt_b",
      })
    ).toBe(false)
  })
})

describe("upload validation rules", () => {
  it("rejects disallowed mime types", () => {
    const result = validateUploadInitRules({
      eventStatus: "active",
      allowVideos: false,
      fileType: "application/pdf",
      fileSize: 1000,
      maxImageBytes: 15 * 1024 * 1024,
      maxVideoBytes: 100 * 1024 * 1024,
      remainingStorageMb: 500,
      activeUploadCount: 0,
      maxFiles: 5000,
    })

    expect(result).toEqual({
      ok: false,
      code: "INVALID_FILE_TYPE",
    })
  })

  it("rejects uploads when storage is exceeded", () => {
    const result = validateUploadInitRules({
      eventStatus: "active",
      allowVideos: false,
      fileType: "image/jpeg",
      fileSize: 6 * 1024 * 1024,
      maxImageBytes: 15 * 1024 * 1024,
      maxVideoBytes: 100 * 1024 * 1024,
      remainingStorageMb: 2,
      activeUploadCount: 0,
      maxFiles: 5000,
    })

    expect(result).toEqual({
      ok: false,
      code: "EVENT_STORAGE_LIMIT_REACHED",
    })
  })
})

describe("delete behavior", () => {
  it("collects all storage keys that should be deleted", () => {
    expect(
      getUploadDeletionKeys({
        storageKeyOriginal: "events/evt/originals/upl.jpg",
        storageKeyOptimized: "events/evt/optimized/upl.webp",
        storageKeyThumbnail: "events/evt/thumbnails/upl.webp",
      })
    ).toEqual([
      "events/evt/originals/upl.jpg",
      "events/evt/optimized/upl.webp",
      "events/evt/thumbnails/upl.webp",
    ])
  })
})

describe("storage accounting", () => {
  it("counts original and derivative assets toward event storage", () => {
    expect(
      calculateStorageUsedMb({
        originalBytes: 2 * 1024 * 1024,
        optimizedBytes: 512 * 1024,
        thumbnailBytes: 256 * 1024,
      })
    ).toBe(3)
  })
})

describe("gallery filtering", () => {
  it("only allows processed image uploads into the gallery", () => {
    expect(
      isGalleryEligibleUpload({
        deletedAt: null,
        status: "PROCESSED",
        mediaType: "IMAGE",
      })
    ).toBe(true)

    expect(
      isGalleryEligibleUpload({
        deletedAt: null,
        status: "UPLOADED",
        mediaType: "IMAGE",
      })
    ).toBe(false)

    expect(
      isGalleryEligibleUpload({
        deletedAt: new Date(),
        status: "PROCESSED",
        mediaType: "IMAGE",
      })
    ).toBe(false)
  })
})
