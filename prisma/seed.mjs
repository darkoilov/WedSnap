import { PrismaClient, EventStatus } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.event.upsert({
    where: { slug: "demo-event" },
    update: {
      name: "Demo Event",
      location: "Skopje",
      status: EventStatus.ACTIVE,
      allowGallery: true,
      allowVideos: false,
      maxStorageMb: 51200,
      maxFiles: 5000,
    },
    create: {
      slug: "demo-event",
      name: "Demo Event",
      eventDate: new Date(),
      location: "Skopje",
      status: EventStatus.ACTIVE,
      allowGallery: true,
      allowVideos: false,
      maxStorageMb: 51200,
      maxFiles: 5000,
      storageUsedMb: 0,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error("Seed failed.", error)
    await prisma.$disconnect()
    process.exit(1)
  })
