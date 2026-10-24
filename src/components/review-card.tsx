import { useLayoutEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Stars } from "@/components/stars"
import type { Business } from "@/content/schema"
import { formatMonthYear } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Карточка отзыва без имени автора. Если есть href, вся карточка ведёт на отзыв в 2ГИС. */
export function ReviewCard({ review, href }: { review: Business["reviews"][number]; href?: string }) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (el && !expanded) setClamped(el.scrollHeight > el.clientHeight + 1)
  }, [expanded])

  return (
    <figure
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors",
        href && "hover:border-primary/50 has-[a:focus-visible]:border-primary",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Stars value={review.rating} className="text-sm" />
        <time dateTime={review.date} className="text-xs text-muted-foreground">
          {formatMonthYear(review.date)}
        </time>
      </div>
      <blockquote className="flex-1">
        <p ref={textRef} className={expanded ? "leading-relaxed" : "line-clamp-6 leading-relaxed"}>
          {review.text}
        </p>
      </blockquote>
      {(clamped || expanded) && (
        // Над ссылкой-подложкой, чтобы раскрытие текста не открывало 2ГИС
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="relative z-10 mt-2 self-start text-sm font-medium text-primary hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Свернуть" : "Читать полностью"}
        </button>
      )}
      {href && (
        <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <a href={href} target="_blank" rel="noopener" className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']">
            Открыть отзыв
          </a>
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </figcaption>
      )}
    </figure>
  )
}
