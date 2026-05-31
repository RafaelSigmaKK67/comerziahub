"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function sendMessage(
  conversationId: string,
  formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const content = ((formData.get("content") as string) || "").trim();
  if (!content) return;

  const part = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: user.id } },
  });
  if (!part) return;

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId: user.id, content },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  revalidatePath("/account/messages");
}
