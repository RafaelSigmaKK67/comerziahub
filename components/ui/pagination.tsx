import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pages,
  makeHref,
}: {
  page: number;
  pages: number;
  makeHref: (p: number) => string;
}) {
  if (pages <= 1) return null;
  const end = Math.min(pages, Math.max(5, page + 2));
  const nums: number[] = [];
  for (let i = Math.max(1, end - 4); i <= end; i++) nums.push(i);

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition";
  const idle = "border-slate-300 text-slate-600 hover:bg-slate-100";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className={cn(base, idle)} aria-label="Anterior">
          ‹
        </Link>
      )}
      {nums.map((n) => (
        <Link
          key={n}
          href={makeHref(n)}
          className={cn(
            base,
            n === page ? "border-brand-500 bg-brand-600 text-white" : idle,
          )}
        >
          {n}
        </Link>
      ))}
      {page < pages && (
        <Link href={makeHref(page + 1)} className={cn(base, idle)} aria-label="Próxima">
          ›
        </Link>
      )}
    </nav>
  );
}
