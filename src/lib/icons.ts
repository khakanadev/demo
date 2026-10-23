import {
  CalendarDays, CircleDot, CreditCard, Crosshair, Disc3, Gamepad2,
  Scale, ShoppingBag, Bandage, Warehouse, Wrench, type LucideIcon,
} from "lucide-react"
import type { iconKeys } from "@/content/keys"

export const icons: Record<(typeof iconKeys)[number], LucideIcon> = {
  calendar: CalendarDays,
  warehouse: Warehouse,
  gamepad: Gamepad2,
  card: CreditCard,
  tire: CircleDot,
  align: Crosshair,
  balance: Scale,
  shop: ShoppingBag,
  wrench: Wrench,
  patch: Bandage,
  brake: Disc3,
}
