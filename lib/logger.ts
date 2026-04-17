type LogLevel = "info" | "warn" | "error"

function log(level: LogLevel, event: string, data?: Record<string, unknown>) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...data,
  }

  if (level === "error") {
    console.error(JSON.stringify(payload))
    return
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload))
    return
  }

  console.info(JSON.stringify(payload))
}

export const logger = {
  info(event: string, data?: Record<string, unknown>) {
    log("info", event, data)
  },
  warn(event: string, data?: Record<string, unknown>) {
    log("warn", event, data)
  },
  error(event: string, data?: Record<string, unknown>) {
    log("error", event, data)
  },
}
