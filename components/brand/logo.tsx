import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  showText = true,
}: {
  href?: string;
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
        <ShoppingBag className="h-5 w-5" />
      </span>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Comerzia<span className="text-brand-600">Hub</span>
        </span>
      )}
    </Link>
  );
}
