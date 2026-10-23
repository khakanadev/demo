import { business } from "@/content/business"
import { useOpenStatus } from "@/hooks/use-open-status"
import { describeStatus } from "@/lib/schedule"
import { cn } from "@/lib/utils"

export function OpenStatus({ className }: { className?: string }) {
  const status = useOpenStatus(business.schedule, business.timezone)
  const tone = status.open ? (status.closingSoon ? "bg-primary" : "bg-success") : "bg-white/35"
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="relative flex size-2">
        {status.open && <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden", tone)} />}
        <span className={cn("relative inline-flex size-2 rounded-full", tone)} />
      </span>
      {describeStatus(status)}
    </span>
  )
}
