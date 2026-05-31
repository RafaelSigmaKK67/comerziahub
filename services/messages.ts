import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

export async function getUserConversations(userId: string) {
  return safeQuery(
    () =>
      prisma.conversation.findMany({
        where: { participants: { some: { userId } } },
        orderBy: { updatedAt: "desc" },
        include: {
          participants: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      }),
    [],
  );
}

export async function getConversation(userId: string, conversationId: string) {
  return safeQuery(
    () =>
      prisma.conversation.findFirst({
        where: { id: conversationId, participants: { some: { userId } } },
        include: {
          participants: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
          messages: {
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, name: true, image: true } } },
          },
        },
      }),
    null,
  );
}
