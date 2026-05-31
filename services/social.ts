import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

export async function getFeedPosts(limit = 30) {
  return safeQuery(
    () =>
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          store: { select: { name: true, slug: true, logoUrl: true } },
          images: { orderBy: { position: "asc" } },
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              images: { take: 1 },
            },
          },
          _count: { select: { likes: true, comments: true, shares: true } },
        },
      }),
    [],
  );
}

export async function isFollowingStore(userId: string, storeId: string) {
  return safeQuery(async () => {
    const f = await prisma.storeFollow.findUnique({
      where: { userId_storeId: { userId, storeId } },
    });
    return !!f;
  }, false);
}

export async function getPostLikedSet(userId: string, postIds: string[]) {
  if (postIds.length === 0) return new Set<string>();
  return safeQuery(async () => {
    const likes = await prisma.postLike.findMany({
      where: { userId, postId: { in: postIds } },
      select: { postId: true },
    });
    return new Set(likes.map((l) => l.postId));
  }, new Set<string>());
}
