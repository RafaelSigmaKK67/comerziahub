import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { memo } from "@/lib/memo-cache";
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
      memo(`activeStores:${limit}`, () =>
        prisma.store.findMany({
          where: { status: "ACTIVE" },
          orderBy: [{ ratingAvg: "desc" }, { followerCount: "desc" }],
          take: limit,
          select: storeCard,
        }),
      ),
    [],
  );
}

export async function listStores(opts: { q?: string; segment?: string }) {
  const { q, segment } = opts;
  return safeQuery(
    () =>
      memo(`listStores:${q ?? ""}:${segment ?? ""}`, () =>
        prisma.store.findMany({
          where: {
            status: "ACTIVE",
            ...(segment ? { segment } : {}),
            ...(q
              ? { name: { contains: q, mode: "insensitive" } }
              : {}),
          },
          orderBy: { ratingAvg: "desc" },
          take: 48,
          select: storeCard,
        }),
      ),
    [],
  );
}

export async function getStoreBySlug(slug: string) {
  return safeQuery(
    () =>
      memo(`store:${slug}`, async () => {
        // Consultas independentes em PARALELO: o Prisma carrega cada relação
        // aninhada em uma query separada e SEQUENCIAL; com o banco em outra
        // região cada ida custa ~200ms, então o tempo de parede cai de
        // ~8 round-trips para o máximo do grupo (~4).
        const [store, businessHours, products, counts] = await Promise.all([
          prisma.store.findUnique({
            where: { slug },
            include: {
              settings: true,
              owner: { select: { id: true, name: true, image: true } },
              address: true,
            },
          }),
          prisma.businessHour.findMany({
            where: { store: { slug } },
            orderBy: { weekday: "asc" },
          }),
          prisma.product.findMany({
            where: { store: { slug }, status: { in: ["ACTIVE", "OUT_OF_STOCK"] } },
            orderBy: { salesCount: "desc" },
            take: 24,
            select: productCard,
          }),
          prisma.store.findUnique({
            where: { slug },
            select: {
              _count: { select: { followers: true, products: true, reviews: true } },
            },
          }),
        ]);
        if (!store) return null;
        return {
          ...store,
          businessHours,
          products,
          _count: counts?._count ?? { followers: 0, products: 0, reviews: 0 },
        };
      }),
    null,
  );
}

export async function getFeaturedProducts(limit = 10) {
  return safeQuery(
    () =>
      memo(`featured:${limit}`, () =>
        prisma.product.findMany({
          where: { status: "ACTIVE", isFeatured: true },
          orderBy: { createdAt: "desc" },
          take: limit,
          select: productCard,
        }),
      ),
    [],
  );
}

export async function getBestSellers(limit = 10) {
  return safeQuery(
    () =>
      memo(`bestSellers:${limit}`, () =>
        prisma.product.findMany({
          where: { status: "ACTIVE" },
          orderBy: { salesCount: "desc" },
          take: limit,
          select: productCard,
        }),
      ),
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
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(minPrice || maxPrice
      ? {
          basePrice: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const key = `search:${q ?? ""}:${categoryId ?? ""}:${minPrice ?? ""}:${maxPrice ?? ""}:${sort}:${page}:${perPage}`;
  return safeQuery(
    () =>
      memo(key, async () => {
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
      }),
    { items: [], total: 0, pages: 1 },
  );
}

export async function getProductById(id: string) {
  return safeQuery(
    () =>
      memo(`product:${id}`, async () => {
        // Mesmo racional do getStoreBySlug: relações independentes em paralelo
        // (antes: 8 round-trips sequenciais ao banco).
        const [product, images, variants, reviews, reviewCount] = await Promise.all([
          prisma.product.findUnique({
            where: { id },
            include: {
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
            },
          }),
          prisma.productImage.findMany({
            where: { productId: id },
            orderBy: { position: "asc" },
          }),
          prisma.productVariant.findMany({
            where: { productId: id },
            orderBy: { position: "asc" },
          }),
          prisma.review.findMany({
            where: { productId: id, type: "PRODUCT" },
            orderBy: { createdAt: "desc" },
            take: 8,
            include: { author: { select: { name: true, image: true } } },
          }),
          prisma.review.count({ where: { productId: id } }),
        ]);
        if (!product) return null;
        return {
          ...product,
          images,
          variants,
          reviews,
          _count: { reviews: reviewCount },
        };
      }),
    null,
  );
}

export async function listCategories() {
  return safeQuery(
    () =>
      memo("categories", () =>
        prisma.category.findMany({
          where: { parentId: null, storeId: null },
          orderBy: { name: "asc" },
          include: { _count: { select: { products: true } } },
        }),
      ),
    [],
  );
}
