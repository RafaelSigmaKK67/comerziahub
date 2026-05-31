import { redirect } from "next/navigation";
import { Newspaper } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StoreSocialPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const posts = await safeQuery(
    () =>
      prisma.post.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { _count: { select: { likes: true, comments: true } } },
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Rede social da loja" description="Publicações, promoções e novidades." />

      {posts.length > 0 ? (
        <div className="mb-6 space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-4">
              <p className="text-sm text-slate-700">{p.content}</p>
              <p className="mt-2 text-xs text-slate-400">
                {p._count.likes} curtidas · {p._count.comments} comentários · {formatRelative(p.createdAt)}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Newspaper} title="Sua loja ainda não publicou nada" className="mb-6" />
      )}

      <ComingSoon
        title="Compositor de publicações da loja"
        description="Publique novidades, promoções e produtos diretamente como a loja, com agendamento."
        ready={["Modelos Post / PostImage com vínculo a loja e produto"]}
      />
    </>
  );
}
