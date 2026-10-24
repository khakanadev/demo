import { useId, type ReactNode } from "react"
import { ArrowUp, MapPin, MessageCircle, Navigation, Send } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { OpenStatus } from "@/components/open-status"
import { business } from "@/content/business"
import { formatRating } from "@/lib/format"
import { navItems } from "@/lib/nav"
import { groupSchedule } from "@/lib/schedule"

const year = new Date().getFullYear()

function ColumnTitle({ children }: { children: string }) {
  return <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">{children}</p>
}

/** Название бизнеса во всю ширину подвала: textLength растягивает надпись любой длины ровно по ширине. */
function Wordmark() {
  const gradient = useId()
  const size = 200
  const width = Math.max(business.name.length, 4) * size * 0.62
  return (
    <svg aria-hidden viewBox={`0 0 ${width} ${size * 0.8}`} className="block w-full select-none">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text x="0" y={size * 0.76} fontSize={size} fontWeight="800" textLength={width} lengthAdjust="spacingAndGlyphs" fill={`url(#${gradient})`}>
        {business.name}
      </text>
    </svg>
  )
}

export function SiteFooter() {
  const { phones, address, city, messengers, links, rating } = business
  const route = links.twoGisRoute ?? links.yandexRoute
  const chips = [
    messengers.whatsapp && { href: messengers.whatsapp, label: "WhatsApp", icon: <MessageCircle /> },
    messengers.telegram && { href: messengers.telegram, label: "Telegram", icon: <Send /> },
    messengers.vk && { href: messengers.vk, label: "ВКонтакте", icon: null },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[]

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/40 pb-(--callbar-h) md:pb-0">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-primary/10 blur-3xl" />

      {/* На десктопе колонки по ширине содержимого и justify-between: промежутки между всеми блоками равные */}
      <div className="px-safe relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 pt-14 sm:grid-cols-3 md:px-6 md:pt-20 lg:flex lg:justify-between lg:gap-12">
        <div className="col-span-2 space-y-5 sm:col-span-3 lg:max-w-xs">
          <BrandMark />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {business.tagline} в {business.cityIn ?? city}. Позвоните или напишите — подскажем цену и свободное время.
          </p>
          <OpenStatus className="text-muted-foreground" />
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/40 px-3.5 text-sm transition-colors hover:border-primary/60 hover:text-primary [&_svg]:size-4"
                >
                  {c.icon}
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Разделы в подвале">
          <ColumnTitle>Разделы</ColumnTitle>
          <ul className="space-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-foreground/85 transition-colors hover:text-primary">{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ColumnTitle>Часы работы</ColumnTitle>
          <dl className="space-y-2.5 text-sm">
            {groupSchedule(business.schedule).map((g) => (
              <div key={g.label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{g.label}</dt>
                <dd className="font-medium tabular-nums">{g.hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="col-span-2 sm:col-span-1 lg:max-w-60">
          <ColumnTitle>Контакты</ColumnTitle>
          <ul className="space-y-3 text-sm">
            {phones.map((p) => (
              <li key={p.value}>
                <a href={`tel:${p.value}`} className="block font-semibold tabular-nums transition-colors hover:text-primary">{p.display}</a>
                <span className="text-xs text-muted-foreground">{p.label}</span>
              </li>
            ))}
            <li className="flex gap-2 pt-1 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{city}, {address.street}{address.note && `, ${address.note}`}</span>
            </li>
            {route && (
              <li>
                <a href={route} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                  <Navigation className="size-3.5" aria-hidden /> Построить маршрут
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="px-safe relative mx-auto mt-12 max-w-6xl text-foreground md:mt-16 md:px-6">
        <Wordmark />
      </div>

      <div className="relative border-t border-border">
        <div className="px-safe mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 text-xs text-muted-foreground md:px-6">
          <p>
            © {year} {business.name}
            {rating && ` · Рейтинг ${formatRating(rating.value)} в ${rating.source}`}
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-primary/60 hover:text-foreground">
            <ArrowUp className="size-3.5" aria-hidden /> Наверх
          </a>
        </div>
      </div>
    </footer>
  )
}
