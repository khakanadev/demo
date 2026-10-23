import { useEffect, useState } from "react"
import type { Business } from "@/content/schema"
import { getOpenStatus } from "@/lib/schedule"

export function useOpenStatus(schedule: Business["schedule"], timezone: string) {
  const [status, setStatus] = useState(() => getOpenStatus(schedule, timezone))
  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus(schedule, timezone)), 30_000)
    return () => window.clearInterval(id)
  }, [schedule, timezone])
  return status
}
