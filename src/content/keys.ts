// Без зависимостей: импортируется и в браузерный код, и в Zod-схему
export const iconKeys = [
  "calendar", "warehouse", "gamepad", "card", "tire", "align",
  "balance", "shop", "wrench", "patch", "brake",
] as const

export const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
export type DayKey = (typeof dayKeys)[number]
