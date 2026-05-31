import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value = 0,
  count,
  size = 14,
  className,
}: {
  value?: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  const full = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-amber-500", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          fill={i <= full ? "currentColor" : "none"}
          className={i <= full ? "" : "text-slate-300"}
        />
      ))}
      {typeof count === "number" && (
        <span className="ml-1 text-xs font-medium text-slate-500">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}
