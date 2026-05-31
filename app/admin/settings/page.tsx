import { PageHeader } from "@/components/dashboard/page-header";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Configurações da plataforma" description="Parâmetros gerais, taxas e permissões." />
      <ComingSoon
        title="Configurações gerais"
        description="Edição de parâmetros globais, taxas padrão e permissões. Persistidos em PlatformSetting."
        ready={[
          "Modelo PlatformSetting (chave/valor JSON) no schema",
          "Controle de permissões via Permission/UserPermission",
          "Taxas por plano em Plan.commissionRate",
        ]}
      />
    </>
  );
}
