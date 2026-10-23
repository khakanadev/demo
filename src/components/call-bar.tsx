import { useEffect, useState } from "react"
import { MessageCircle, Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { business, primaryPhone } from "@/content/business"
import { cn } from "@/lib/utils"

/** Нижняя панель на телефоне: появляется, когда кнопки первого экрана ушли из вида. */
export function CallBar() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "px-safe pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex gap-2.5">
        <a href={`tel:${primaryPhone.value}`} className={cn(buttonVariants({ size: "xl" }), "flex-1")}>
          <Phone /> Позвонить
        </a>
        {business.messengers.whatsapp && (
          <a
            href={business.messengers.whatsapp}
            target="_blank"
            rel="noopener"
            className={cn(buttonVariants({ variant: "secondary", size: "icon-xl" }))}
            aria-label="Написать в WhatsApp"
          >
            <MessageCircle />
          </a>
        )}
      </div>
    </div>
  )
}
