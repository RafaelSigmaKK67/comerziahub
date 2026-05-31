import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { homeFor } from "@/lib/rbac";

// Após o login, direciona o usuário para o painel do seu papel.
export default async function ContinuePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  redirect(homeFor(user.role));
}
