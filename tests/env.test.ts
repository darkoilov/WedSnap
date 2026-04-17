import { beforeEach, describe, expect, it, vi } from "vitest"

describe("env validation", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  it("throws when required env vars are missing", async () => {
    delete process.env.DATABASE_URL
    delete process.env.R2_ACCOUNT_ID

    const { getEnv } = await import("@/lib/env")

    expect(() => getEnv()).toThrow(/Invalid environment configuration/)
  })

  it("parses valid env configuration", async () => {
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/wedsnap?schema=public"
    process.env.R2_ACCOUNT_ID = "account"
    process.env.R2_BUCKET_NAME = "bucket"
    process.env.R2_ACCESS_KEY_ID = "key"
    process.env.R2_SECRET_ACCESS_KEY = "secret"
    process.env.R2_PUBLIC_BASE_URL = ""
    process.env.SIGNED_URL_EXPIRY_SECONDS = "600"
    process.env.MAX_UPLOAD_MB_DEFAULT = "15"
    process.env.MAX_EVENT_STORAGE_MB_DEFAULT = "51200"
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"

    const { getEnv } = await import("@/lib/env")
    const env = getEnv()

    expect(env.DATABASE_URL).toContain("wedsnap")
    expect(env.SIGNED_URL_EXPIRY_SECONDS).toBe(600)
    expect(env.MAX_UPLOAD_MB_DEFAULT).toBe(15)
  })
})
