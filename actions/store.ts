"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStoreRole } from "@/lib/rbac";
import { slugify } from "@/lib/utils";
import { storeSchema, productSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

async function currentStore(userId: string) {
  return prisma.store.findFirst({ where: { ownerId: userId } });
}

export async function createStore(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || (!isStoreRole(user.role) && user.role !== "ADMIN")) {
    return { error: "Sem permissão para criar loja." };
  }

  const parsed = storeSchema.safeParse({
    name: formData.get("name"),
    segment: formData.get("segment") || undefined,
    description: formData.get("description") || undefined,
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    return { error: "Verifique os campos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const base = slugify(parsed.data.name) || "loja";
  let slug = base;
  let i = 1;
  while (await prisma.store.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }

  await prisma.store.create({
    data: {
      name: parsed.data.name,
      slug,
      segment: parsed.data.segment,
      description: parsed.data.description,
      phone: parsed.data.phone,
      ownerId: user.id,
      status: "ACTIVE",
      settings: { create: {} },
      members: { create: { userId: user.id, role: "OWNER" } },
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Faça login." };
  const store = await currentStore(user.id);
  if (!store) return { error: "Crie sua loja primeiro." };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    basePrice: formData.get("basePrice"),
    promoPrice: formData.get("promoPrice") || undefined,
    stock: formData.get("stock") || 0,
    status: formData.get("status") || "ACTIVE",
  });
  if (!parsed.success) {
    return { error: "Verifique os campos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const base = slugify(parsed.data.name) || "produto";
  let slug = base;
  let i = 1;
  while (await prisma.product.findFirst({ where: { storeId: store.id, slug } })) {
    slug = `${base}-${i++}`;
  }

  const imageUrl = (formData.get("imageUrl") as string) || null;

  await prisma.product.create({
    data: {
      storeId: store.id,
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId || null,
      basePrice: parsed.data.basePrice,
      promoPrice: parsed.data.promoPrice || null,
      stock: parsed.data.stock,
      status: parsed.data.status,
      ...(imageUrl ? { images: { create: { url: imageUrl, isPrimary: true } } } : {}),
    },
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateStoreSettings(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const store = await currentStore(user.id);
  if (!store) return;

  const num = (k: string) => Number(formData.get(k) ?? 0) || 0;
  const bool = (k: string) => formData.get(k) === "on";

  await prisma.$transaction([
    prisma.store.update({
      where: { id: store.id },
      data: { isOpen: bool("isOpen") },
    }),
    prisma.storeSettings.upsert({
      where: { storeId: store.id },
      update: {
        minOrderValue: num("minOrderValue"),
        prepTimeMinutes: Math.round(num("prepTimeMinutes")),
        deliveryFeeBase: num("deliveryFeeBase"),
        deliveryFeePerKm: num("deliveryFeePerKm"),
        maxDeliveryRadiusKm: num("maxDeliveryRadiusKm"),
        acceptsDelivery: bool("acceptsDelivery"),
        acceptsPickup: bool("acceptsPickup"),
        cashbackEnabled: bool("cashbackEnabled"),
        loyaltyEnabled: bool("loyaltyEnabled"),
      },
      create: {
        storeId: store.id,
        minOrderValue: num("minOrderValue"),
        prepTimeMinutes: Math.round(num("prepTimeMinutes")),
        deliveryFeeBase: num("deliveryFeeBase"),
        deliveryFeePerKm: num("deliveryFeePerKm"),
        maxDeliveryRadiusKm: num("maxDeliveryRadiusKm"),
        acceptsDelivery: bool("acceptsDelivery"),
        acceptsPickup: bool("acceptsPickup"),
        cashbackEnabled: bool("cashbackEnabled"),
        loyaltyEnabled: bool("loyaltyEnabled"),
      },
    }),
  ]);

  revalidatePath("/dashboard/settings");
}

export async function saveCashbackRule(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const store = await currentStore(user.id);
  if (!store) return;

  const type = (formData.get("type") as "PERCENT" | "FIXED") || "PERCENT";

  await prisma.$transaction([
    prisma.cashbackRule.updateMany({
      where: { storeId: store.id, active: true },
      data: { active: false },
    }),
    prisma.cashbackRule.create({
      data: {
        storeId: store.id,
        name: (formData.get("name") as string) || "Campanha de cashback",
        type,
        value: Number(formData.get("value") ?? 0) || 0,
        minOrderValue: Number(formData.get("minOrderValue") ?? 0) || 0,
        releaseAfterDays: Math.round(Number(formData.get("releaseAfterDays") ?? 0) || 0),
        validityDays: Math.round(Number(formData.get("validityDays") ?? 90) || 90),
        excludePromoProducts: formData.get("excludePromoProducts") === "on",
        active: true,
      },
    }),
    prisma.storeSettings.upsert({
      where: { storeId: store.id },
      update: { cashbackEnabled: true },
      create: { storeId: store.id, cashbackEnabled: true },
    }),
  ]);

  revalidatePath("/dashboard/cashback");
}
