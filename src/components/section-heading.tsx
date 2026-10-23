import type { ReactNode } from "react"

export function SectionHeading({ id, eyebrow, title, aside }: { id: string; eyebrow: string; title: string; aside?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-10">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        <h2 id={id} className="text-[1.75rem] leading-[1.1] font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  )
}
