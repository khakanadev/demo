import { business } from "@/content/business"

export function BrandMark() {
  return (
    <a href="#top" className="flex items-center gap-2.5 rounded-lg" aria-label={`${business.name} — наверх`}>
      <span aria-hidden className="grid size-9 place-items-center rounded-[0.7rem] bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-[0.95rem] font-bold tracking-tight">{business.name}</span>
        <span className="mt-1 block text-[0.7rem] text-muted-foreground">{business.kind}</span>
      </span>
    </a>
  )
}
