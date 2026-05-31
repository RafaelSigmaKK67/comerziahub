import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency, formatDate, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TX_LABELS: Record<string, string> = {
  EARNED: "Recebido",
  REDEEMED: "Utilizado",
  EXPIRED: "Expirado",
  REVERSED: "Estornado",
};

export default async function AccountCashbackPage() {
  const user = await getCurrentUser();
  const [wallets, txs] = await Promise.all([
    safeQuery(
      () => prisma.cashbackWallet.findMany({ where: { userId: user!.id }, include: { store: { select: { name: true } } } }),
      [],
    ),
    safeQuery(
      () =>
        prisma.cashbackTransaction.findMany({
          where: { userId: user!.id },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { store: { select: { name: true } } },
        }),
      [],
    ),
  ]);
  const total = wallets.reduce((s, w) => s + toNumber(w.balance), 0);

  return (
    <>
      <PageHeader title="Cashback" description="Seu saldo de cashback por loja." />

      <Card className="mb-6 flex items-center gap-4 bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
        <Wallet className="h-10 w-10" />
        <div>
          <p className="text-sm text-brand-100">Saldo total disponível</p>
          <p className="text-3xl font-extrabold">{formatCurrency(total)}</p>
        </div>
      </Card>

      {wallets.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((w) => (
            <Card key={w.id} className="p-4">
              <p className="text-sm text-slate-500">{w.store.name}</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(w.balance)}</p>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 font-semibold text-slate-900">Histórico</h2>
      {txs.length === 0 ? (
        <EmptyState icon={Wallet} title="Nenhuma movimentação de cashback ainda" />
      ) : (
        <Card className="divide-y divide-slate-100">
          {txs.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{t.store.name}</p>
                <p className="text-xs text-slate-400">{formatDate(t.createdAt)} · {t.status}</p>
              </div>
              <div className="text-right">
                <Badge className={t.type === "EARNED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                  {TX_LABELS[t.type]}
                </Badge>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{formatCurrency(t.amount)}</p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
