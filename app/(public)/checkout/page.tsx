import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCurrentUser } from "@/lib/session";
import { getCartDetailed } from "@/services/cart";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/checkout");

  const cart = await getCartDetailed(user.id);
  if (!cart || cart.items.length === 0) redirect("/cart");

  const addresses = await safeQuery(
    () =>
      prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { isDefault: "desc" },
      }),
    [],
  );

  const addressOptions = addresses.map((a) => ({
    id: a.id,
    label:
      [a.label, a.street, a.number, a.city].filter(Boolean).join(", ") ||
      "Endereço",
  }));

  const lines = cart.items.map((i) => ({
    name: i.product.name,
    quantity: i.quantity,
    total: toNumber(i.unitPrice) * i.quantity,
    store: i.product.store.name,
  }));
  const subtotal = lines.reduce((s, l) => s + l.total, 0);

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold text-slate-900">Finalizar compra</h1>
      <p className="mt-1 text-sm text-slate-500">
        Revise os itens, escolha entrega e pagamento.
      </p>
      <div className="mt-6">
        <CheckoutForm
          addresses={addressOptions}
          lines={lines}
          subtotal={subtotal}
        />
      </div>
    </div>
  );
}
