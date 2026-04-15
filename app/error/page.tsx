"use client"

import { useRouter } from "next/navigation"
import { ErrorPage } from "@/components/error"

export default function InvalidEventPage() {
  const router = useRouter()

  return (
    <ErrorPage
      title="Настанот не постои"
      message="Линкот што го отворивте е невалиден или настанот е избришан."
      onBack={() => router.push("/")}
      backButtonText="Назад"
    />
  )
}
