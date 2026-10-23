import { Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { business, primaryPhone } from "@/content/business"
import { cn } from "@/lib/utils"

export function FinalCta() {
  return (
    <section aria-label="Записаться по телефону" className="px-safe mx-auto max-w-6xl pb-20 md:px-6 md:pb-28">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-7 text-primary-foreground md:p-12">
        <svg aria-hidden viewBox="0 0 200 200" className="absolute -top-16 -right-16 size-72 opacity-15 md:size-96" fill="none" stroke="currentColor" strokeWidth="10">
          <circle cx="100" cy="100" r="88" />
          <circle cx="100" cy="100" r="40" />
          <path d="M100 12v28M100 160v28M12 100h28M160 100h28M38 38l20 20M142 142l20 20M38 162l20-20M142 58l20-20" />
        </svg>
        <p className="relative text-sm font-semibold tracking-[0.18em] uppercase opacity-70">Запись по телефону</p>
        <h2 className="relative mt-3 max-w-2xl text-3xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl">
          Позвоните, и подберём удобное время
        </h2>
        <a href={`tel:${primaryPhone.value}`} className="relative mt-6 block text-2xl font-bold tabular-nums underline-offset-4 hover:underline md:text-4xl">
          {primaryPhone.display}
        </a>
        <a
          href={`tel:${primaryPhone.value}`}
          className={cn(buttonVariants({ size: "xl" }), "relative mt-8 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 sm:w-auto")}
        >
          <Phone /> Позвонить в {business.name}
        </a>
      </div>
    </section>
  )
}
