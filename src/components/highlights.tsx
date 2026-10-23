import { business } from "@/content/business"
import { icons } from "@/lib/icons"

export function Highlights() {
  return (
    <section aria-label="Коротко о нас" className="px-safe mx-auto mt-10 max-w-6xl md:mt-4 md:px-6">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {business.highlights.map((item) => {
          const Icon = icons[item.icon]
          return (
            <li key={item.title} className="rounded-2xl border border-border bg-card p-4 md:p-5">
              <Icon className="mb-3 size-5 text-primary" aria-hidden />
              <p className="font-semibold leading-snug">{item.title}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.text}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
