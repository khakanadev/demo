import { useLayoutEffect, useRef, useState } from "react"
import { Stars } from "@/components/stars"
import type { Business } from "@/content/schema"
import { formatMonthYear } from "@/lib/format"

export function ReviewCard({ review }: { review: Business["reviews"][number] }) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (el && !expanded) setClamped(el.scrollHeight > el.clientHeight + 1)
  }, [expanded])

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
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
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 self-start text-sm font-medium text-primary hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Свернуть" : "Читать полностью"}
        </button>
      )}
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4 text-sm">
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">
          {review.author[0]}
        </span>
        {review.author}
      </figcaption>
    </figure>
  )
}
