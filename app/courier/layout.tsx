import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { homeFor } from "@/lib/rbac";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function CourierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/courier");
  if (user.role !== "COURIER" && user.role !== "ADMIN") {
    redirect(homeFor(user.role));
  }
  return (
    <DashboardShell navKey="courier" user={user}>
      {children}
    </DashboardShell>
  );
}
