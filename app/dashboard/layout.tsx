import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { homeFor, isStoreRole } from "@/lib/rbac";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function StoreDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/dashboard");
  if (!isStoreRole(user.role) && user.role !== "ADMIN") {
    redirect(homeFor(user.role));
  }
  return (
    <DashboardShell navKey="store" user={user}>
      {children}
    </DashboardShell>
  );
}
