import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { ProductForm } from "@/components/dashboard/product-form";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { listCategories } from "@/services/catalog";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const categories = await listCategories();

  return (
    <>
      <PageHeader title="Novo produto" description="Cadastre um item no seu catálogo." />
      <Card className="p-6">
        <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </Card>
    </>
  );
}
