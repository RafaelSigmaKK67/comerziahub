import { MapPin, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressForm } from "@/components/account/address-form";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { deleteAddress } from "@/actions/account";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  const addresses = await safeQuery(
    () => prisma.address.findMany({ where: { userId: user!.id }, orderBy: { isDefault: "desc" } }),
    [],
  );

  return (
    <>
      <PageHeader title="Endereços" description="Gerencie seus endereços de entrega." />
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {addresses.length === 0 && (
            <Card className="p-6 text-sm text-slate-500">Nenhum endereço cadastrado ainda.</Card>
          )}
          {addresses.map((a) => (
            <Card key={a.id} className="flex items-start justify-between p-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand-600" />
                <div>
                  <p className="flex items-center gap-2 font-medium text-slate-800">
                    {a.label || "Endereço"}
                    {a.isDefault && <Badge className="bg-brand-50 text-brand-700">Padrão</Badge>}
                  </p>
                  <p className="text-sm text-slate-500">
                    {[a.street, a.number, a.district, a.city, a.state].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
              <form action={deleteAddress.bind(null, a.id)}>
                <button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Novo endereço</h2>
          <AddressForm />
        </Card>
      </div>
    </>
  );
}
