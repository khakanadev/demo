import { useState } from "react"
import { Expand } from "lucide-react"
import { Lightbox } from "@/components/lightbox"
import { SectionHeading } from "@/components/section-heading"
import { business } from "@/content/business"
import { cn } from "@/lib/utils"

// Раскладка «мозаики» на десктопе: первые кадры крупнее
const tile = ["md:col-span-2 md:row-span-2", "md:row-span-2", "", "", "md:col-span-2", "", ""]

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const images = business.gallery
  if (images.length === 0) return null

  return (
    <section aria-labelledby="gallery-title" id="gallery" className="mx-auto max-w-6xl py-4 md:px-6 md:py-8">
      <div className="px-safe md:px-0">
        <SectionHeading id="gallery-title" eyebrow="Фото" title="Цех, стенды и зона ожидания" />
      </div>
      <ul className="no-scrollbar px-safe flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 md:grid md:auto-rows-[200px] md:grid-cols-4 md:overflow-visible md:px-0 lg:auto-rows-[230px]">
        {images.map((image, i) => (
          <li key={image.src} className={cn("w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto", tile[i % tile.length])}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-card md:aspect-auto md:h-full"
              aria-label={`Открыть фото: ${image.alt}`}
            >
              <img
                src={image.thumb}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                width={image.w}
                height={image.h}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset" />
              <span aria-hidden className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onIndexChange={setIndex} />
    </section>
  )
}
