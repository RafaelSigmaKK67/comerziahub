"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import type {
  OrderStatus,
  PlanInterval,
  ProductStatus,
  StoreStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

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

// ======================== ADMIN CRUD COMPLETO ==============================
// O admin é o papel máximo da plataforma: cria, edita e exclui qualquer
// usuário, loja, produto, categoria, pedido e plano.

const num = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

// ---- Usuários -------------------------------------------------------------

export async function createUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const email = str(formData.get("email")).toLowerCase();
  const password = str(formData.get("password"));
  if (!email || password.length < 6) return;
  try {
    await prisma.user.create({
      data: {
        name: str(formData.get("name")) || email.split("@")[0],
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: (str(formData.get("role")) || "CUSTOMER") as UserRole,
        status: "ACTIVE",
      },
    });
  } catch {
    // e-mail duplicado — ignora silenciosamente
  }
  revalidatePath("/admin/users");
}

export async function updateUser(userId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const data: {
    name?: string;
    email?: string;
    role?: UserRole;
    passwordHash?: string;
  } = {};
  const name = str(formData.get("name"));
  const email = str(formData.get("email")).toLowerCase();
  const role = str(formData.get("role")) as UserRole;
  const password = str(formData.get("password"));
  if (name) data.name = name;
  if (email) data.email = email;
  // não permite rebaixar o próprio admin logado
  if (role && !(userId === admin.id && role !== "ADMIN")) data.role = role;
  if (password.length >= 6) data.passwordHash = await bcrypt.hash(password, 10);
  try {
    await prisma.user.update({ where: { id: userId }, data });
  } catch {
    // e-mail duplicado — mantém o anterior
  }
  revalidatePath("/admin/users");
}

// ---- Lojas ----------------------------------------------------------------

export async function updateStore(storeId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  await prisma.store.update({
    where: { id: storeId },
    data: {
      name: str(formData.get("name")) || undefined,
      segment: str(formData.get("segment")) || null,
      status: (str(formData.get("status")) || undefined) as StoreStatus | undefined,
      isOpen: formData.get("isOpen") === "on",
    },
  });
  revalidatePath("/admin/stores");
  revalidatePath("/admin");
}

// ---- Produtos ---------------------------------------------------------------

export async function adminUpdateProduct(productId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const promo = str(formData.get("promoPrice"));
  await prisma.product.update({
    where: { id: productId },
    data: {
      name: str(formData.get("name")) || undefined,
      basePrice: num(formData.get("basePrice")) || undefined,
      promoPrice: promo ? num(formData.get("promoPrice")) : null,
      costPrice: str(formData.get("costPrice")) ? num(formData.get("costPrice")) : null,
      stock: num(formData.get("stock")),
      status: (str(formData.get("status")) || undefined) as ProductStatus | undefined,
      isFeatured: formData.get("isFeatured") === "on",
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
}

export async function adminDeleteProduct(productId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch {
    // tem pedidos/carrinhos vinculados — pausa em vez de apagar
    await prisma.product.update({ where: { id: productId }, data: { status: "PAUSED" } });
  }
  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
}

// ---- Categorias -------------------------------------------------------------

export async function createCategory(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const name = str(formData.get("name"));
  if (!name) return;
  try {
    await prisma.category.create({
      data: { name, slug: slugify(name), icon: str(formData.get("icon")) || null },
    });
  } catch {
    // slug duplicado
  }
  revalidatePath("/admin/categories");
}

export async function updateCategory(categoryId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const name = str(formData.get("name"));
  if (!name) return;
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { name, icon: str(formData.get("icon")) || null },
    });
  } catch {
    // noop
  }
  revalidatePath("/admin/categories");
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  // desvincula os produtos antes (categoria é opcional no produto)
  await prisma.product.updateMany({ where: { categoryId }, data: { categoryId: null } });
  await prisma.category.updateMany({ where: { parentId: categoryId }, data: { parentId: null } });
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  revalidatePath("/marketplace");
}

// ---- Pedidos ----------------------------------------------------------------

export async function adminSetOrderStatus(orderId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const status = str(formData.get("status")) as OrderStatus;
  if (!status) return;
  const stamps: Record<string, Date> = {};
  if (status === "ACCEPTED") stamps.acceptedAt = new Date();
  if (status === "READY") stamps.readyAt = new Date();
  if (status === "DELIVERED" || status === "COMPLETED") stamps.deliveredAt = new Date();
  if (status === "CANCELLED" || status === "REJECTED") stamps.cancelledAt = new Date();
  await prisma.order.update({ where: { id: orderId }, data: { status, ...stamps } });
  await prisma.orderStatusHistory.create({
    data: { orderId, status, note: "Alterado pelo administrador" },
  }).catch(() => undefined);
  revalidatePath("/admin/orders");
}

// ---- Planos -----------------------------------------------------------------

export async function createPlan(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const name = str(formData.get("name"));
  if (!name) return;
  try {
    await prisma.plan.create({
      data: {
        name,
        description: str(formData.get("description")) || null,
        price: num(formData.get("price")),
        interval: (str(formData.get("interval")) || "MONTHLY") as PlanInterval,
        commissionRate: num(formData.get("commissionRate")),
        maxProducts: str(formData.get("maxProducts")) ? Math.trunc(num(formData.get("maxProducts"))) : null,
        active: formData.get("active") === "on",
      },
    });
  } catch {
    // nome duplicado
  }
  revalidatePath("/admin/plans");
}

export async function updatePlan(planId: string, formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  try {
    await prisma.plan.update({
      where: { id: planId },
      data: {
        name: str(formData.get("name")) || undefined,
        description: str(formData.get("description")) || null,
        price: num(formData.get("price")),
        interval: (str(formData.get("interval")) || "MONTHLY") as PlanInterval,
        commissionRate: num(formData.get("commissionRate")),
        maxProducts: str(formData.get("maxProducts")) ? Math.trunc(num(formData.get("maxProducts"))) : null,
        active: formData.get("active") === "on",
      },
    });
  } catch {
    // nome duplicado
  }
  revalidatePath("/admin/plans");
}

export async function deletePlan(planId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  try {
    await prisma.plan.delete({ where: { id: planId } });
  } catch {
    // tem assinaturas — desativa em vez de apagar
    await prisma.plan.update({ where: { id: planId }, data: { active: false } });
  }
  revalidatePath("/admin/plans");
}
