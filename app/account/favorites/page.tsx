import { Heart } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProductCard } from "@/components/commerce/product-card";
import { StoreCard } from "@/components/commerce/store-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const [favs, follows] = await Promise.all([
    safeQuery(
      () =>
        prisma.productFavorite.findMany({
          where: { userId: user!.id },
          include: {
            product: {
              include: { images: { take: 1 }, store: { select: { name: true, slug: true } } },
            },
          },
        }),
      [],
    ),
    safeQuery(
      () => prisma.storeFollow.findMany({ where: { userId: user!.id }, include: { store: true } }),
      [],
    ),
  ]);

  return (
    <>
      <PageHeader title="Favoritos" description="Seus produtos favoritos e lojas que você segue." />

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-slate-900">Produtos</h2>
        {favs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favs.map((f) => (
              <ProductCard key={f.id} product={f.product} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Heart} title="Nenhum produto favoritado" />
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">Lojas seguidas</h2>
        {follows.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {follows.map((f) => (
              <StoreCard key={f.id} store={f.store} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Heart} title="Você ainda não segue lojas" />
        )}
      </section>
    </>
  );
}
