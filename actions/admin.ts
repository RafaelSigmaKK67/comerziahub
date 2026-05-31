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
