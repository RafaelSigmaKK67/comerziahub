import { cn } from "@/lib/utils";
import { Card } from "./card";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "brand",
}: {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: string;
  accent?: "brand" | "accent" | "emerald" | "sky" | "rose" | "amber";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-100 text-brand-700",
    accent: "bg-accent-100 text-accent-700",
    emerald: "bg-emerald-100 text-emerald-700",
    sky: "bg-sky-100 text-sky-700",
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              tones[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
