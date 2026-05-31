import { Flag, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatRelative } from "@/lib/utils";
import { resolveReport } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await safeQuery(
    () =>
      prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { reporter: { select: { name: true } } },
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Denúncias" description="Conteúdos e usuários reportados na rede social." />
      {reports.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nenhuma denúncia pendente" description="Tudo tranquilo por aqui." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-rose-500" />
                  <span className="font-medium text-slate-800">{r.targetType}</span>
                  <Badge className="bg-slate-100 text-slate-600">{r.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{r.reason}</p>
                <p className="text-xs text-slate-400">
                  por {r.reporter.name} · {formatRelative(r.createdAt)}
                </p>
              </div>
              {r.status === "PENDING" && (
                <div className="flex gap-2">
                  <form action={resolveReport.bind(null, r.id, "RESOLVED")}>
                    <Button size="sm" type="submit">Resolver</Button>
                  </form>
                  <form action={resolveReport.bind(null, r.id, "DISMISSED")}>
                    <Button size="sm" variant="outline" type="submit">Descartar</Button>
                  </form>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
