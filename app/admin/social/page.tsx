import { Newspaper } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatRelative } from "@/lib/utils";
import { setPostVisibility } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const posts = await safeQuery(
    () =>
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          author: { select: { name: true } },
          store: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Moderação da rede social" description="Acompanhe e modere as publicações." />
      {posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="Nenhuma publicação ainda" />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {p.store?.name ?? p.author.name}
                  </span>
                  <Badge
                    className={
                      p.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.content}</p>
                <p className="text-xs text-slate-400">
                  {p._count.likes} curtidas · {p._count.comments} comentários · {formatRelative(p.createdAt)}
                </p>
              </div>
              {p.status === "PUBLISHED" ? (
                <form action={setPostVisibility.bind(null, p.id, "HIDDEN")}>
                  <Button size="sm" variant="outline" type="submit">Ocultar</Button>
                </form>
              ) : (
                <form action={setPostVisibility.bind(null, p.id, "PUBLISHED")}>
                  <Button size="sm" type="submit">Restaurar</Button>
                </form>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
