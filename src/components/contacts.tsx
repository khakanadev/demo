import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { OpenStatus } from "@/components/open-status"
import { SectionHeading } from "@/components/section-heading"
import { business } from "@/content/business"
import { currentDayKey, dayNames, groupSchedule } from "@/lib/schedule"
import { dayKeys } from "@/content/keys"
import { cn } from "@/lib/utils"

// Виджет Яндекс Карт работает без API-ключа и привычен аудитории в России
function mapSrc(lat: number, lon: number) {
  const params = new URLSearchParams({ ll: `${lon},${lat}`, z: "16", pt: `${lon},${lat},pm2ylm`, lang: "ru_RU" })
  return `https://yandex.ru/map-widget/v1/?${params}`
}

export function Contacts() {
  const { address, phones, messengers, links, schedule, timezone, city } = business
  const today = currentDayKey(timezone)
  const fullAddress = [city, address.street, address.note].filter(Boolean).join(", ")

  return (
    <section aria-labelledby="contacts-title" id="contacts" className="px-safe mx-auto max-w-6xl pb-20 md:px-6 md:pb-28">
      <SectionHeading id="contacts-title" eyebrow="Контакты" title="Приезжайте или звоните" />
      <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col rounded-2xl border border-border bg-card p-5 md:p-6 lg:flex-auto">
            <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-primary" aria-hidden /> Телефоны
            </p>
            <ul className="space-y-3">
              {phones.map((phone) => (
                <li key={phone.value}>
                  <a href={`tel:${phone.value}`} className="group flex items-baseline justify-between gap-4">
                    <span className="text-[1.35rem] font-semibold whitespace-nowrap tabular-nums group-hover:text-primary md:text-2xl">{phone.display}</span>
                    <span className="text-right text-xs text-muted-foreground">{phone.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            {(messengers.whatsapp || messengers.telegram || messengers.vk) && (
              <div className="mt-5 flex flex-wrap gap-2 lg:mt-auto lg:pt-5">
                {messengers.whatsapp && (
                  <a href={messengers.whatsapp} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-10 rounded-xl px-4")}>
                    <MessageCircle /> WhatsApp
                  </a>
                )}
                {messengers.telegram && (
                  <a href={messengers.telegram} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-10 rounded-xl px-4")}>
                    Telegram
                  </a>
                )}
                {messengers.vk && (
                  <a href={messengers.vk} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-10 rounded-xl px-4")}>
                    ВКонтакте
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-card p-5 md:p-6 lg:flex-auto">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" aria-hidden /> Часы работы
              </p>
              <OpenStatus className="text-xs text-muted-foreground" />
            </div>
            <dl className="grid grid-cols-7 gap-1.5 text-center lg:my-auto">
              {dayKeys.map((key) => {
                const hours = schedule[key]
                const isToday = key === today
                return (
                  <div key={key} className={cn("rounded-xl px-0.5 py-2.5", isToday ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                    <dt className={cn("text-xs font-semibold", !isToday && "text-muted-foreground")}>
                      <abbr title={dayNames[key].long} className="no-underline">{dayNames[key].short}</abbr>
                    </dt>
                    <dd className="mt-1 text-[0.7rem] leading-tight font-medium tabular-nums sm:text-xs">
                      {hours ? (
                        <>
                          {hours[0]}
                          <br />
                          {hours[1]}
                        </>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                )
              })}
            </dl>
            <p className="sr-only">
              {groupSchedule(schedule).map((g) => `${g.label} ${g.hours}`).join("; ")}
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative min-h-72 flex-1 bg-secondary">
            <iframe
              title={`Карта: ${fullAddress}`}
              src={mapSrc(address.lat, address.lon)}
              loading="lazy"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="block font-semibold">{address.street}{address.note && `, ${address.note}`}</span>
                <span className="text-sm text-muted-foreground">
                  {[address.district, city, address.postalCode].filter(Boolean).join(", ")}
                </span>
              </span>
            </p>
            <div className="flex gap-2">
              {links.twoGisRoute && (
                <a href={links.twoGisRoute} target="_blank" rel="noopener" className={cn(buttonVariants({ size: "lg" }), "h-11 flex-1 rounded-xl px-4 font-semibold md:flex-none")}>
                  <Navigation /> Маршрут в 2ГИС
                </a>
              )}
              {links.yandexRoute && (
                <a href={links.yandexRoute} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-11 flex-1 rounded-xl px-4 md:flex-none")}>
                  Яндекс Карты
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
