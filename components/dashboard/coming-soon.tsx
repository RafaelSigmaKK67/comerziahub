import { Hammer, Check } from "lucide-react";

export function ComingSoon({
  title,
  description,
  ready,
}: {
  title: string;
  description?: string;
  ready?: string[];
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Hammer className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-800">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description ??
          "Tela em construção. O modelo de dados já existe no schema Prisma — as ações e a UI completas estão no roadmap."}
      </p>
      {ready && ready.length > 0 && (
        <ul className="mx-auto mt-4 max-w-xs space-y-1.5 text-left text-sm text-slate-600">
          {ready.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
