const memoryStore = new Map<string, number[]>()

export function getClientIp(request: Request) {
  const forwarded =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")

  if (!forwarded) {
    return "unknown"
  }

  return forwarded.split(",")[0]?.trim() || "unknown"
}

export function consumeRateLimit(input: {
  key: string
  limit: number
  windowMs: number
}) {
  const now = Date.now()
  const windowStart = now - input.windowMs
  const entries = memoryStore.get(input.key) ?? []
  const activeEntries = entries.filter((timestamp) => timestamp > windowStart)

  if (activeEntries.length >= input.limit) {
    memoryStore.set(input.key, activeEntries)
    return {
      allowed: false,
      remaining: 0,
      resetAt: activeEntries[0] + input.windowMs,
    }
  }

  activeEntries.push(now)
  memoryStore.set(input.key, activeEntries)

  return {
    allowed: true,
    remaining: Math.max(input.limit - activeEntries.length, 0),
    resetAt: now + input.windowMs,
  }
}
