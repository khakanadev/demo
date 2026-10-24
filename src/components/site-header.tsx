import { useEffect, useState } from "react"
import { Phone } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { business, primaryPhone } from "@/content/business"
import { useOpenStatus } from "@/hooks/use-open-status"
import { navItems } from "@/lib/nav"
import { describeStatusShort } from "@/lib/schedule"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const status = useOpenStatus(business.schedule, business.timezone)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300",
        scrolled ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="px-safe mx-auto flex h-(--header-h) max-w-6xl items-center justify-between gap-4 md:px-6">
        <BrandMark />
        <nav aria-label="Разделы" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        {/* Номер и кнопка звонка — одна «таблетка»: иконка, статус работы и телефон */}
        <a
          href={`tel:${primaryPhone.value}`}
          aria-label={`Позвонить ${primaryPhone.display}`}
          className="group flex items-center gap-2.5 rounded-full transition-colors sm:border sm:border-border sm:bg-card/70 sm:py-1 sm:pr-4 sm:pl-1 sm:backdrop-blur sm:hover:border-primary/60"
        >
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105 sm:size-9">
            <Phone className="size-[1.1rem]" aria-hidden />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
              <span aria-hidden className={cn("size-1.5 rounded-full", status.open ? "bg-success" : "bg-white/35")} />
              {describeStatusShort(status)}
            </span>
            <span className="block text-sm font-semibold tabular-nums">{primaryPhone.display}</span>
          </span>
        </a>
      </div>
    </header>
  )
}
