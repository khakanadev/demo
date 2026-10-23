import { useCallback, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Business } from "@/content/schema"

type Props = {
  images: Business["gallery"]
  index: number | null
  onIndexChange: (index: number | null) => void
}

/** Нативный <dialog>: фокус-ловушка, Esc и возврат фокуса даёт браузер; «Назад» закрывает через history. */
export function Lightbox({ images, index, onIndexChange }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const open = index !== null

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndexChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onIndexChange],
  )

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      history.pushState({ lightbox: true }, "")
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const onPop = () => onIndexChange(null)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [onIndexChange])

  const close = () => {
    if (history.state?.lightbox) history.back()
    else onIndexChange(null)
  }

  const image = index !== null ? images[index] : null

  return (
    <dialog
      ref={ref}
      aria-label="Просмотр фото"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1)
        if (e.key === "ArrowLeft") step(-1)
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-foreground backdrop:bg-black/80"
    >
      {image && (
        <div className="flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-white/60 tabular-nums">
              {index! + 1} / {images.length}
            </span>
            <button type="button" onClick={close} autoFocus className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Закрыть">
              <X className="size-5" />
            </button>
          </div>
          <figure className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2 md:px-20">
            <img key={image.src} src={image.src} alt={image.alt} className="max-h-full max-w-full animate-in object-contain fade-in" />
            <figcaption className="mt-3 px-4 text-center text-sm text-white/60">{image.alt}</figcaption>
            <button type="button" onClick={() => step(-1)} className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid" aria-label="Предыдущее фото">
              <ChevronLeft />
            </button>
            <button type="button" onClick={() => step(1)} className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid" aria-label="Следующее фото">
              <ChevronRight />
            </button>
          </figure>
          <div className="flex justify-center gap-3 py-4 md:hidden">
            <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full bg-white/10" aria-label="Предыдущее фото">
              <ChevronLeft />
            </button>
            <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full bg-white/10" aria-label="Следующее фото">
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
