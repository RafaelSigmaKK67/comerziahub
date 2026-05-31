import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { StoreSettingsForm } from "@/components/dashboard/store-settings-form";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StoreSettingsPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const s = store.settings;

  return (
    <>
      <PageHeader title="Configurações da loja" description="Entrega, retirada, horários e benefícios." />
      <Card className="p-6">
        <StoreSettingsForm
          isOpen={store.isOpen}
          settings={{
            minOrderValue: toNumber(s?.minOrderValue),
            prepTimeMinutes: s?.prepTimeMinutes ?? 30,
            deliveryFeeBase: toNumber(s?.deliveryFeeBase),
            deliveryFeePerKm: toNumber(s?.deliveryFeePerKm),
            maxDeliveryRadiusKm: s?.maxDeliveryRadiusKm ?? 10,
            acceptsDelivery: s?.acceptsDelivery ?? true,
            acceptsPickup: s?.acceptsPickup ?? true,
            cashbackEnabled: s?.cashbackEnabled ?? false,
            loyaltyEnabled: s?.loyaltyEnabled ?? false,
          }}
        />
      </Card>
    </>
  );
}
