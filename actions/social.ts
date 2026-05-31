"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { postSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

export async function createPost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Faça login para publicar." };

  const parsed = postSchema.safeParse({
    content: formData.get("content"),
    storeId: (formData.get("storeId") as string) || undefined,
    productId: (formData.get("productId") as string) || undefined,
  });
  if (!parsed.success) return { error: "Escreva algo para publicar." };

  await prisma.post.create({
    data: {
      authorId: user.id,
      content: parsed.data.content,
      type: parsed.data.productId ? "PRODUCT" : "TEXT",
      storeId: parsed.data.storeId,
      productId: parsed.data.productId,
    },
  });

  revalidatePath("/feed");
  return { success: true, message: "Publicado!" };
}

export async function togglePostLike(
  postId: string,
): Promise<{ error?: string; success?: boolean; liked?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH_REQUIRED" };

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.postLike.delete({ where: { id: existing.id } }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    revalidatePath("/feed");
    return { success: true, liked: false };
  }

  await prisma.$transaction([
    prisma.postLike.create({ data: { userId: user.id, postId } }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);
  revalidatePath("/feed");
  return { success: true, liked: true };
}

export async function addComment(postId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH_REQUIRED" };
  if (!content.trim()) return { error: "Comentário vazio." };

  await prisma.$transaction([
    prisma.comment.create({
      data: { postId, authorId: user.id, content: content.trim() },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),
  ]);
  revalidatePath("/feed");
  return { success: true };
}

/** Seguir / deixar de seguir uma loja (usado como server action de formulário). */
export async function toggleStoreFollow(storeId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const existing = await prisma.storeFollow.findUnique({
    where: { userId_storeId: { userId: user.id, storeId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.storeFollow.delete({ where: { id: existing.id } }),
      prisma.store.update({
        where: { id: storeId },
        data: { followerCount: { decrement: 1 } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.storeFollow.create({ data: { userId: user.id, storeId } }),
      prisma.store.update({
        where: { id: storeId },
        data: { followerCount: { increment: 1 } },
      }),
    ]);
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { slug: true },
  });
  if (store) revalidatePath(`/store/${store.slug}`);
}
