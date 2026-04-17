import "server-only"

import sharp from "sharp"

export async function generateImageDerivatives(originalBuffer: Buffer) {
  const image = sharp(originalBuffer, { failOn: "none" }).rotate()
  const metadata = await image.metadata()

  const optimizedBuffer = await image
    .clone()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()

  const thumbnailBuffer = await image
    .clone()
    .resize({ width: 300, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer()

  return {
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    optimizedBuffer,
    thumbnailBuffer,
  }
}
