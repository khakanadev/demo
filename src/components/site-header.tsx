import { useEffect, useState } from "react"
import { Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"
import { primaryPhone } from "@/content/business"
import { navItems } from "@/lib/nav"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
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
        {/* Одна кнопка в стиле остальных: на телефоне иконка, на планшете «Позвонить», на десктопе номер */}
        <a
          href={`tel:${primaryPhone.value}`}
          aria-label={`Позвонить ${primaryPhone.display}`}
          className={cn(buttonVariants({ size: "lg" }), "size-10 rounded-xl p-0 font-semibold sm:w-auto sm:px-4")}
        >
          <Phone aria-hidden />
          <span className="hidden sm:inline lg:hidden">Позвонить</span>
          <span className="hidden tabular-nums lg:inline">{primaryPhone.display}</span>
        </a>
      </div>
    </header>
  )
}
