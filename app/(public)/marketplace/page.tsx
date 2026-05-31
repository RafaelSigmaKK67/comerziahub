import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { StoreCard } from "@/components/commerce/store-card";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { searchProducts, listStores, listCategories } from "@/services/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Marketplace" };

const SORTS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliados" },
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const categoryId = sp.categoryId || undefined;
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;
  const sort = (sp.sort as "recent" | "price_asc" | "price_desc" | "rating") || "recent";

  const [products, stores, categories] = await Promise.all([
    searchProducts({ q, categoryId, minPrice, maxPrice, sort }),
    q ? listStores({ q }) : Promise.resolve([]),
    listCategories(),
  ]);

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        {q ? `Resultados para “${q}”` : "Marketplace"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {products.length} produto(s){stores.length ? ` · ${stores.length} loja(s)` : ""}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filtros */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <p className="flex items-center gap-2 font-semibold text-slate-900">
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </p>
          <form className="mt-4 space-y-4" action="/marketplace">
            {q && <input type="hidden" name="q" value={q} />}
            <div>
              <label className="label-base">Categoria</label>
              <select name="categoryId" defaultValue={categoryId ?? ""} className="input-base">
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label-base">Preço mín.</label>
                <input name="minPrice" type="number" min={0} defaultValue={sp.minPrice ?? ""} className="input-base" placeholder="R$" />
              </div>
              <div>
                <label className="label-base">Preço máx.</label>
                <input name="maxPrice" type="number" min={0} defaultValue={sp.maxPrice ?? ""} className="input-base" placeholder="R$" />
              </div>
            </div>
            <div>
              <label className="label-base">Ordenar por</label>
              <select name="sort" defaultValue={sort} className="input-base">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">Aplicar filtros</Button>
            <Link href="/marketplace" className="block text-center text-sm text-slate-500 hover:underline">
              Limpar
            </Link>
          </form>
        </aside>

        {/* Resultados */}
        <div className="space-y-8">
          {stores.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Lojas</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stores.map((s) => (
                  <StoreCard key={s.id} store={s} />
                ))}
              </div>
            </section>
          )}

          <section>
            {stores.length > 0 && (
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Produtos</h2>
            )}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-medium text-slate-700">Nada encontrado</p>
                <p className="mt-1 text-sm text-slate-500">
                  Ajuste os filtros ou rode o seed com dados de exemplo.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
