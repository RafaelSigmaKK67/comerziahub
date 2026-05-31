import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { getCurrentUser } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHeader title="Configurações" description="Seus dados e preferências de privacidade." />

      <Card className="mb-6 flex items-center gap-4 p-6">
        <Avatar src={user!.image} name={user!.name} size={56} />
        <div>
          <p className="text-lg font-semibold text-slate-900">{user!.name}</p>
          <p className="text-sm text-slate-500">{user!.email}</p>
          <Badge className="mt-1 bg-brand-50 text-brand-700">{ROLE_LABELS[user!.role]}</Badge>
        </div>
      </Card>

      <ComingSoon
        title="Edição de perfil e privacidade"
        description="Atualize foto, dados pessoais, senha e controle quem vê seu perfil."
        ready={["Campos isPrivate, bio, image no modelo User", "Recuperação de senha via PasswordResetToken"]}
      />
    </>
  );
}
