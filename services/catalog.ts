import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import type { Prisma } from "@prisma/client";

const storeCard = {
  id: true,
  slug: true,
  name: true,
  segment: true,
  logoUrl: true,
  bannerUrl: true,
  ratingAvg: true,
  ratingCount: true,
  isOpen: true,
  address: { select: { city: true } },
} satisfies Prisma.StoreSelect;

const productCard = {
  id: true,
  name: true,
  basePrice: true,
  promoPrice: true,
  promoStartsAt: true,
  promoEndsAt: true,
  ratingAvg: true,
  ratingCount: true,
  status: true,
  images: { take: 1, orderBy: { position: "asc" as const } },
  store: { select: { name: true, slug: true } },
} satisfies Prisma.ProductSelect;

export async function getActiveStores(limit = 12) {
  return safeQuery(
    () =>
      prisma.store.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ ratingAvg: "desc" }, { followerCount: "desc" }],
        take: limit,
        select: storeCard,
      }),
    [],
  );
}

export async function listStores(opts: { q?: string; segment?: string }) {
  const { q, segment } = opts;
  return safeQuery(
    () =>
      prisma.store.findMany({
        where: {
          status: "ACTIVE",
          ...(segment ? { segment } : {}),
          ...(q
            ? { name: { contains: q } }
            : {}),
        },
        orderBy: { ratingAvg: "desc" },
        take: 48,
        select: storeCard,
      }),
    [],
  );
}

export async function getStoreBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.store.findUnique({
        where: { slug },
        include: {
          settings: true,
          businessHours: { orderBy: { weekday: "asc" } },
          owner: { select: { id: true, name: true, image: true } },
          address: true,
          _count: { select: { followers: true, products: true, reviews: true } },
          products: {
            where: { status: { in: ["ACTIVE", "OUT_OF_STOCK"] } },
            orderBy: { salesCount: "desc" },
            take: 24,
            select: productCard,
          },
        },
      }),
    null,
  );
}

export async function getFeaturedProducts(limit = 10) {
  return safeQuery(
    () =>
      prisma.product.findMany({
        where: { status: "ACTIVE", isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: productCard,
      }),
    [],
  );
}

export async function getBestSellers(limit = 10) {
  return safeQuery(
    () =>
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        orderBy: { salesCount: "desc" },
        take: limit,
        select: productCard,
      }),
    [],
  );
}

export async function searchProducts(opts: {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "recent" | "price_asc" | "price_desc" | "rating";
  page?: number;
  perPage?: number;
}) {
  const { q, categoryId, minPrice, maxPrice, sort = "recent", page = 1, perPage = 24 } = opts;
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { basePrice: "asc" }
      : sort === "price_desc"
        ? { basePrice: "desc" }
        : sort === "rating"
          ? { ratingAvg: "desc" }
          : { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    ...(categoryId ? { categoryId } : {}),
    ...(q ? { name: { contains: q } } : {}),
    ...(minPrice || maxPrice
      ? {
          basePrice: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  return safeQuery(
    async () => {
      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          take: perPage,
          skip: (page - 1) * perPage,
          select: productCard,
        }),
        prisma.product.count({ where }),
      ]);
      return { items, total, pages: Math.max(1, Math.ceil(total / perPage)) };
    },
    { items: [], total: 0, pages: 1 },
  );
}

export async function getProductById(id: string) {
  return safeQuery(
    () =>
      prisma.product.findUnique({
        where: { id },
        include: {
          images: { orderBy: { position: "asc" } },
          variants: { orderBy: { position: "asc" } },
          category: true,
          store: {
            select: {
              id: true,
              slug: true,
              name: true,
              logoUrl: true,
              ratingAvg: true,
              ratingCount: true,
              isOpen: true,
              settings: { select: { cashbackEnabled: true } },
            },
          },
          reviews: {
            where: { type: "PRODUCT" },
            orderBy: { createdAt: "desc" },
            take: 8,
            include: { author: { select: { name: true, image: true } } },
          },
          _count: { select: { reviews: true } },
        },
      }),
    null,
  );
}

export async function listCategories() {
  return safeQuery(
    () =>
      prisma.category.findMany({
        where: { parentId: null, storeId: null },
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
    [],
  );
}
