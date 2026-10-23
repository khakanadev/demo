import { dayKeys, type DayKey } from "@/content/keys"
import type { Business } from "@/content/schema"

export const dayNames: Record<DayKey, { short: string; long: string }> = {
  mon: { short: "Пн", long: "Понедельник" },
  tue: { short: "Вт", long: "Вторник" },
  wed: { short: "Ср", long: "Среда" },
  thu: { short: "Чт", long: "Четверг" },
  fri: { short: "Пт", long: "Пятница" },
  sat: { short: "Сб", long: "Суббота" },
  sun: { short: "Вс", long: "Воскресенье" },
}

const weekdayIndex: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

/** День недели и минуты от полуночи в часовом поясе бизнеса, а не браузера. */
export function zonedNow(timezone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  return {
    dayIndex: weekdayIndex[get("weekday")],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  }
}

export type OpenStatus =
  | { open: true; closesAt: string; closingSoon: boolean }
  | { open: false; opensAt: string; opensDay: "today" | "tomorrow" | DayKey }
  | { open: false; opensAt: null; opensDay: null }

export function getOpenStatus(schedule: Business["schedule"], timezone: string, date = new Date()): OpenStatus {
  const { dayIndex, minutes } = zonedNow(timezone, date)
  const today = schedule[dayKeys[dayIndex]]

  if (today) {
    const [from, to] = today
    if (minutes >= toMinutes(from) && minutes < toMinutes(to)) {
      return { open: true, closesAt: to, closingSoon: toMinutes(to) - minutes <= 60 }
    }
    if (minutes < toMinutes(from)) return { open: false, opensAt: from, opensDay: "today" }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const key = dayKeys[(dayIndex + offset) % 7]
    const hours = schedule[key]
    if (hours) return { open: false, opensAt: hours[0], opensDay: offset === 1 ? "tomorrow" : key }
  }
  return { open: false, opensAt: null, opensDay: null }
}

export function describeStatus(status: OpenStatus) {
  if (status.open) return status.closingSoon ? `Скоро закроется · до ${status.closesAt}` : `Открыто до ${status.closesAt}`
  if (!status.opensAt) return "Временно не работает"
  const when =
    status.opensDay === "today" ? "сегодня" :
    status.opensDay === "tomorrow" ? "завтра" :
    `в ${dayNames[status.opensDay].short.toLowerCase()}`
  return `Закрыто · откроется ${when} в ${status.opensAt}`
}

export function currentDayKey(timezone: string): DayKey {
  return dayKeys[zonedNow(timezone).dayIndex]
}

/** Группирует одинаковые дни подряд: «Пн–Пт 09:00–19:00». */
export function groupSchedule(schedule: Business["schedule"]) {
  const groups: { days: DayKey[]; hours: [string, string] | null }[] = []
  for (const key of dayKeys) {
    const hours = schedule[key]
    const last = groups.at(-1)
    if (last && String(last.hours) === String(hours)) last.days.push(key)
    else groups.push({ days: [key], hours })
  }
  return groups.map(({ days, hours }) => ({
    label: days.length > 1 ? `${dayNames[days[0]].short}–${dayNames[days.at(-1)!].short}` : dayNames[days[0]].short,
    hours: hours ? `${hours[0]}–${hours[1]}` : "выходной",
  }))
}
