import Link from "next/link";
import { MessageSquare, Send } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { getUserConversations, getConversation } from "@/services/messages";
import { sendMessage } from "@/actions/messages";
import { formatRelative, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const user = await getCurrentUser();
  const sp = await searchParams;
  const conversations = await getUserConversations(user!.id);

  const activeId = sp.c ?? conversations[0]?.id;
  const active = activeId ? await getConversation(user!.id, activeId) : null;

  const other = (parts: typeof conversations[number]["participants"]) =>
    parts.find((p) => p.user.id !== user!.id)?.user;

  if (conversations.length === 0) {
    return (
      <>
        <PageHeader title="Mensagens" description="Converse com lojas e vendedores." />
        <EmptyState
          icon={MessageSquare}
          title="Nenhuma conversa ainda"
          description="Suas conversas com lojas e vendedores aparecerão aqui."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Mensagens" description="Converse com lojas e vendedores." />
      <Card className="grid h-[70vh] grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
        {/* Lista de conversas */}
        <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
          <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto">
            {conversations.map((c) => {
              const o = other(c.participants);
              const last = c.messages[0];
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <Link
                    href={`/account/messages?c=${c.id}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition hover:bg-slate-100",
                      isActive && "bg-brand-50",
                    )}
                  >
                    <Avatar src={o?.image} name={o?.name} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{o?.name ?? "Conversa"}</p>
                      {last && <p className="truncate text-xs text-slate-400">{last.content}</p>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Thread */}
        <section className="flex h-[70vh] flex-col">
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
                <Avatar src={other(active.participants)?.image} name={other(active.participants)?.name} size={36} />
                <p className="font-medium text-slate-900">{other(active.participants)?.name}</p>
              </header>

              <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
                {active.messages.map((m) => {
                  const mine = m.sender.id === user!.id;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                          mine
                            ? "bg-brand-600 text-white"
                            : "bg-slate-100 text-slate-800",
                        )}
                      >
                        {m.content}
                        <span className={cn("mt-1 block text-[10px]", mine ? "text-brand-100" : "text-slate-400")}>
                          {formatRelative(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form action={sendMessage.bind(null, active.id)} className="flex items-center gap-2 border-t border-slate-200 p-3">
                <Input name="content" placeholder="Escreva uma mensagem..." autoComplete="off" required />
                <Button type="submit" size="icon" aria-label="Enviar">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
              Selecione uma conversa.
            </div>
          )}
        </section>
      </Card>
    </>
  );
}
