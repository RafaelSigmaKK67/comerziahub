import { PageHeader } from "@/components/dashboard/page-header";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Mensagens" description="Converse com lojas e vendedores." />
      <ComingSoon
        title="Mensagens privadas"
        description="Chat entre comprador e vendedor, com notificações em tempo real."
        ready={[
          "Modelos Conversation / ConversationParticipant / Message no schema",
          "Notificações (Notification) já modeladas",
        ]}
      />
    </>
  );
}
