"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { addressSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

export async function createAddress(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Faça login." };

  const parsed = addressSchema.safeParse({
    label: formData.get("label") || undefined,
    recipientName: formData.get("recipientName") || undefined,
    phone: formData.get("phone") || undefined,
    zip: formData.get("zip") || undefined,
    street: formData.get("street"),
    number: formData.get("number") || undefined,
    complement: formData.get("complement") || undefined,
    district: formData.get("district") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
  });
  if (!parsed.success) {
    return { error: "Verifique os campos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const count = await prisma.address.count({ where: { userId: user.id } });
  await prisma.address.create({
    data: { ...parsed.data, userId: user.id, isDefault: count === 0 },
  });

  revalidatePath("/account/addresses");
  return { success: true, message: "Endereço adicionado." };
}

export async function deleteAddress(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await prisma.address.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/account/addresses");
}
