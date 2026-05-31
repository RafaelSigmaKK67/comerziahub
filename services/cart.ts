import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

/** Soma das quantidades no carrinho do usuário (0 se vazio / sem banco). */
export async function getCartItemCount(userId: string): Promise<number> {
  return safeQuery(async () => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { items: { select: { quantity: true } } },
    });
    if (!cart) return 0;
    return cart.items.reduce((sum, i) => sum + i.quantity, 0);
  }, 0);
}

/** Carrinho completo com produtos/variações para a página /cart. */
export async function getCartDetailed(userId: string) {
  return safeQuery(async () => {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
          include: {
            product: {
              include: { images: { take: 1 }, store: true },
            },
            variant: true,
          },
        },
      },
    });
  }, null);
}
