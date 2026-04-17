import "server-only"

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { getEnv } from "@/lib/env"

let cachedClient: S3Client | null = null

function getR2Client() {
  if (cachedClient) {
    return cachedClient
  }

  const env = getEnv()

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })

  return cachedClient
}

function getBucketName() {
  return getEnv().R2_BUCKET_NAME
}

export async function createSignedUploadUrl(input: {
  key: string
  contentType: string
  expiresInSeconds?: number
}) {
  const env = getEnv()
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: input.key,
    ContentType: input.contentType,
  })

  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: input.expiresInSeconds ?? env.SIGNED_URL_EXPIRY_SECONDS,
  })

  return {
    uploadUrl,
    headers: {
      "Content-Type": input.contentType,
    },
  }
}

export async function headObjectIfExists(key: string) {
  try {
    const response = await getR2Client().send(
      new HeadObjectCommand({
        Bucket: getBucketName(),
        Key: key,
      })
    )

    return {
      exists: true,
      contentLength: response.ContentLength ?? 0,
      contentType: response.ContentType ?? null,
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      typeof error.name === "string" &&
      (error.name === "NotFound" || error.name === "NoSuchKey" || error.name === "NotFoundError")
    ) {
      return {
        exists: false,
        contentLength: 0,
        contentType: null,
      }
    }

    throw error
  }
}

export async function deleteObject(key: string) {
  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    })
  )
}

export async function getSignedReadUrl(key: string, expiresInSeconds?: number) {
  const env = getEnv()
  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  })

  return getSignedUrl(getR2Client(), command, {
    expiresIn: expiresInSeconds ?? env.SIGNED_URL_EXPIRY_SECONDS,
  })
}

export async function getObjectBuffer(key: string) {
  const response = await getR2Client().send(
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    })
  )

  if (!response.Body) {
    throw new Error(`Object body missing for key ${key}`)
  }

  const chunks: Uint8Array[] = []
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}

export async function putObject(input: {
  key: string
  body: Buffer
  contentType: string
  cacheControl?: string
}) {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: input.cacheControl,
    })
  )
}
