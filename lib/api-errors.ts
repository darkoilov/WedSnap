export class ApiRouteError extends Error {
  code: string
  status: number
  details?: Record<string, unknown>

  constructor(input: {
    code: string
    message: string
    status: number
    details?: Record<string, unknown>
  }) {
    super(input.message)
    this.name = "ApiRouteError"
    this.code = input.code
    this.status = input.status
    this.details = input.details
  }
}

export function toApiErrorPayload(error: unknown) {
  if (error instanceof ApiRouteError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    }
  }

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again.",
      },
    },
  }
}
