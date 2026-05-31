import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartView, type CartLine } from "@/components/commerce/cart-view";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { getCartDetailed } from "@/services/cart";
import { toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Carrinho" };

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Entre para ver seu carrinho"
          description="Você precisa estar logado para adicionar e revisar produtos."
          action={
            <Link href="/login?callbackUrl=/cart" className={buttonVariants({ variant: "primary" })}>
              Entrar
            </Link>
          }
        />
      </div>
    );
  }

  const cart = await getCartDetailed(user.id);
  const items: CartLine[] = (cart?.items ?? []).map((i) => ({
    id: i.id,
    productId: i.productId,
    name: i.product.name,
    image: i.product.images[0]?.url ?? null,
    storeName: i.product.store.name,
    variant: i.variant?.name ?? null,
    unitPrice: toNumber(i.unitPrice),
    quantity: i.quantity,
  }));

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900">Seu carrinho</h1>
      <p className="mt-1 text-sm text-slate-500">{items.length} item(ns)</p>

      <div className="mt-6">
        {items.length > 0 ? (
          <CartView items={items} />
        ) : (
          <EmptyState
            icon={ShoppingCart}
            title="Seu carrinho está vazio"
            description="Explore o marketplace e adicione produtos."
            action={
              <Link href="/marketplace" className={buttonVariants({ variant: "primary" })}>
                Ir ao marketplace
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
