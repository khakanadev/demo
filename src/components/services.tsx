import { ArrowUpRight, Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"
import { business, primaryPhone } from "@/content/business"
import { formatPrice } from "@/lib/format"
import { icons } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function Services() {
  return (
    <section aria-labelledby="services-title" id="services" className="px-safe mx-auto max-w-6xl py-16 md:px-6 md:py-28">
      <SectionHeading id="services-title" eyebrow="Услуги" title="Всё для колёс — в одном месте" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {business.services.map((service) => {
          const Icon = icons[service.icon]
          return (
            <li key={service.title}>
              <a
                href={`tel:${primaryPhone.value}`}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary"
                aria-label={`${service.title}: позвонить и узнать цену`}
              >
                <ArrowUpRight className="absolute top-5 right-5 size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden />
                <div className="flex items-center gap-4 pr-8 sm:flex-col sm:items-start sm:gap-8 sm:pr-0">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
                </div>
                <p className="mt-3 flex-1 text-sm sm:mt-1.5 leading-relaxed text-muted-foreground">{service.text}</p>
                <p className="mt-3 text-sm font-semibold sm:mt-5">
                  {service.price ? `от ${formatPrice(service.price)}` : <span className="text-primary">Цена по телефону</span>}
                </p>
              </a>
            </li>
          )
        })}
      </ul>
      <div className="grain mt-6 flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <p className="max-w-xl text-pretty text-muted-foreground">
          {business.pricesNote}
        </p>
        <a href={`tel:${primaryPhone.value}`} className={cn(buttonVariants({ size: "xl" }), "shrink-0")}>
          <Phone />
          Узнать цену
        </a>
      </div>
    </section>
  )
}
