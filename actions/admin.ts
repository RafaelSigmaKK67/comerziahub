"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { StoreStatus, UserStatus } from "@prisma/client";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/** Exclui a loja; se houver dados dependentes (FK), suspende em vez de apagar. */
export async function deleteStore(storeId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  try {
    await prisma.store.delete({ where: { id: storeId } });
  } catch {
    await prisma.store.update({ where: { id: storeId }, data: { status: "SUSPENDED" } });
  }
  revalidatePath("/admin/stores");
  revalidatePath("/admin");
}

/** Exclui o usuário; se houver dados dependentes, bane em vez de apagar. */
export async function deleteUser(userId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin || admin.id === userId) return;
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    await prisma.user.update({ where: { id: userId }, data: { status: "BANNED" } });
  }
  revalidatePath("/admin/users");
}

/** Configurações gerais da plataforma (chave/valor JSON em PlatformSetting). */
export async function updatePlatformSettings(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const value = {
    appName: (formData.get("appName") as string) || "ComerziaHub",
    defaultCommission: Number(formData.get("defaultCommission") ?? 8) || 0,
    defaultCashback: Number(formData.get("defaultCashback") ?? 5) || 0,
    supportEmail: (formData.get("supportEmail") as string) || "",
    about: (formData.get("about") as string) || "",
  };
  await prisma.platformSetting.upsert({
    where: { key: "general" },
    update: { value },
    create: { key: "general", value, description: "Configurações gerais" },
  });
  revalidatePath("/admin/settings");
}

export async function setStoreStatus(storeId: string, status: StoreStatus): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  await prisma.store.update({ where: { id: storeId }, data: { status } });
  revalidatePath("/admin/stores");
  revalidatePath("/admin");
}

export async function setUserStatus(userId: string, status: UserStatus): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/admin/users");
}

export async function setPostVisibility(
  postId: string,
  status: "PUBLISHED" | "HIDDEN" | "REMOVED",
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) return;
  await prisma.post.update({ where: { id: postId }, data: { status } });
  revalidatePath("/admin/social");
  revalidatePath("/feed");
}

export async function resolveReport(
  reportId: string,
  status: "RESOLVED" | "DISMISSED",
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) return;
  await prisma.report.update({
    where: { id: reportId },
    data: { status, resolvedById: user.id },
  });
  revalidatePath("/admin/reports");
}
