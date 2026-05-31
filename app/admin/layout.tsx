import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { homeFor } from "@/lib/rbac";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/admin");
  if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
    redirect(homeFor(user.role));
  }
  return (
    <DashboardShell navKey="admin" user={user}>
      {children}
    </DashboardShell>
  );
}
