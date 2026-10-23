import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ReviewCard } from "@/components/review-card"
import { SectionHeading } from "@/components/section-heading"
import { Stars } from "@/components/stars"
import { business } from "@/content/business"
import { formatRating, plural } from "@/lib/format"
import { cn } from "@/lib/utils"

export function Reviews() {
  const { reviews, rating, links } = business
  if (reviews.length === 0) return null

  const summary = rating && (
    <div className="flex items-center gap-4">
      <span className="text-5xl leading-none font-bold tracking-tight tabular-nums">{formatRating(rating.value)}</span>
      <span className="text-sm text-muted-foreground">
        <Stars value={rating.value} className="mb-1.5 text-base" />
        <span className="block">
          {rating.votes} {plural(rating.votes, "оценка", "оценки", "оценок")} · {rating.reviews}{" "}
          {plural(rating.reviews, "отзыв", "отзыва", "отзывов")} в {rating.source}
        </span>
      </span>
    </div>
  )

  return (
    <section aria-labelledby="reviews-title" id="reviews" className="mx-auto max-w-6xl py-16 md:px-6 md:py-28">
      <div className="px-safe md:px-0">
        <SectionHeading id="reviews-title" eyebrow="Отзывы" title="Что говорят клиенты" aside={summary} />
      </div>
      <ul className="no-scrollbar px-safe flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
        {reviews.map((review) => (
          <li key={review.author + review.date} className="w-[86%] shrink-0 snap-start sm:w-[60%] md:w-auto">
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
      {links.twoGisReviews && (
        <div className="px-safe mt-6 md:px-0">
          <a href={links.twoGisReviews} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-xl px-5")}>
            Все отзывы в {rating?.source ?? "2ГИС"}
            <ArrowUpRight />
          </a>
        </div>
      )}
    </section>
  )
}
