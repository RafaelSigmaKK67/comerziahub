import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { PlatformSettingsForm, type PlatformSettingsValue } from "@/components/admin/platform-settings-form";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { PAYMENT_FEES, DEFAULT_COMMISSION_PCT } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const setting = await safeQuery(
    () => prisma.platformSetting.findUnique({ where: { key: "general" } }),
    null,
  );
  const value = (setting?.value as PlatformSettingsValue) ?? {};

  return (
    <>
      <PageHeader
        title="Configurações da plataforma"
        description="Parâmetros gerais, taxas e textos institucionais."
      />

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-slate-900">Geral</h2>
        <PlatformSettingsForm value={value} />
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-semibold text-slate-900">Taxas por forma de pagamento</h2>
        <p className="mt-1 text-sm text-slate-500">
          Referência usada nos cálculos financeiros (comissão padrão: {DEFAULT_COMMISSION_PCT}%).
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 pr-3">Forma</th>
                <th className="py-2 pr-3">Taxa (%)</th>
                <th className="py-2 pr-3">Taxa fixa</th>
                <th className="py-2">Prazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(PAYMENT_FEES).map((f) => (
                <tr key={f.label}>
                  <td className="py-2 pr-3 font-medium text-slate-800">{f.label}</td>
                  <td className="py-2 pr-3 text-slate-600">{f.feePct}%</td>
                  <td className="py-2 pr-3 text-slate-600">R$ {f.feeFixed.toFixed(2)}</td>
                  <td className="py-2 text-slate-500">{f.days === 0 ? "na hora" : `${f.days} dia(s)`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
