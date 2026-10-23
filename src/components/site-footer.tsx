import { BrandMark } from "@/components/brand-mark"
import { business } from "@/content/business"
import { navItems } from "@/lib/nav"

const year = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-(--callbar-h) md:pb-0">
      <div className="px-safe mx-auto flex max-w-6xl flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="space-y-3">
          <BrandMark />
          <p className="max-w-sm text-sm text-muted-foreground">{business.tagline}. {business.city}, {business.address.street}.</p>
        </div>
        <nav aria-label="Разделы в подвале" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-foreground">{item.label}</a>
          ))}
        </nav>
      </div>
      <div className="px-safe mx-auto max-w-6xl pb-8 text-xs text-muted-foreground/70 md:px-6">
        © {year} {business.name}
        {business.rating && ` · Рейтинг и отзывы — ${business.rating.source}`}
      </div>
    </footer>
  )
}
