import { MapPin, MessageCircle, Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { OpenStatus } from "@/components/open-status"
import { Stars } from "@/components/stars"
import { business, primaryPhone } from "@/content/business"
import { formatRating, plural } from "@/lib/format"
import { cn } from "@/lib/utils"

export function Hero() {
  const { hero, rating, address, messengers } = business
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden md:pt-(--header-h)">
      <div className="mx-auto grid max-w-6xl md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:px-6 md:py-16 lg:gap-16">
        <div className="relative md:order-2">
          <picture>
            <source media="(min-width: 768px)" srcSet={hero.image} />
            <img
              src={hero.imageSmall}
              alt={hero.imageAlt}
              fetchPriority="high"
              width={1200}
              height={1600}
              className="h-[min(68svh,560px)] w-full object-cover md:aspect-[4/5] md:h-auto md:rounded-3xl"
            />
          </picture>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background md:hidden" />
          <div aria-hidden className="absolute inset-0 hidden rounded-3xl ring-1 ring-white/10 ring-inset md:block" />
          {rating && (
            <a
              href={business.links.twoGisReviews ?? "#reviews"}
              target="_blank"
              rel="noopener"
              className="absolute right-4 bottom-28 flex items-center gap-3 rounded-2xl border border-white/10 bg-background/75 px-4 py-3 backdrop-blur-xl md:right-auto md:bottom-10 md:-left-8"
            >
              <span className="text-3xl leading-none font-bold tabular-nums">{formatRating(rating.value)}</span>
              <span className="text-xs leading-tight text-muted-foreground">
                <Stars value={rating.value} className="mb-1 text-sm" />
                <span className="block">
                  {rating.votes} {plural(rating.votes, "оценка", "оценки", "оценок")} в {rating.source}
                </span>
              </span>
            </a>
          )}
        </div>

        <div className="px-safe relative -mt-24 md:order-1 md:mt-0 md:px-0">
          <OpenStatus className="rise mb-5 rounded-full border border-border bg-card/80 px-3 py-1.5 backdrop-blur" />
          <h1 id="hero-title" className="rise text-[2.4rem] leading-[1.02] font-bold tracking-[-0.03em] text-balance [animation-delay:60ms] sm:text-5xl lg:text-[4rem]">
            {hero.title}
          </h1>
          <p className="rise mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground [animation-delay:120ms] md:text-lg">
            {hero.subtitle}
          </p>
          <div className="rise mt-8 flex gap-3 [animation-delay:180ms]">
            <a href={`tel:${primaryPhone.value}`} className={cn(buttonVariants({ size: "xl" }), "flex-1 sm:flex-none")}>
              <Phone />
              Позвонить
            </a>
            {messengers.whatsapp && (
              <a
                href={messengers.whatsapp}
                target="_blank"
                rel="noopener"
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "border-white/15 bg-white/5")}
                aria-label="Написать в WhatsApp"
              >
                <MessageCircle />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
          </div>
          <a href="#contacts" className="rise mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors [animation-delay:240ms] hover:text-foreground">
            <MapPin className="size-4 text-primary" />
            {business.city}, {address.street}
            {address.note && `, ${address.note}`}
          </a>
        </div>
      </div>
    </section>
  )
}
