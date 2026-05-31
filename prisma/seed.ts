/**
 * Seed do ComerziaHub — dados fictícios para desenvolvimento/demonstração.
 * Rode com: npm run db:seed
 *
 * Credenciais de teste (senha para todas: "senha123"):
 *   admin@comerziahub.com        -> Administrador
 *   moderador@comerziahub.com    -> Moderador
 *   loja@comerziahub.com         -> Dono de loja
 *   loja2@comerziahub.com        -> Dono de loja
 *   funcionario@comerziahub.com  -> Funcionário
 *   cliente@comerziahub.com      -> Cliente
 *   cliente2@comerziahub.com     -> Cliente
 *   entregador@comerziahub.com   -> Entregador
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TIERS = [
  { name: "Bronze", level: 1, minOrders: 0, minSpend: 0, color: "#b45309" },
  { name: "Prata", level: 2, minOrders: 5, minSpend: 250, color: "#64748b" },
  { name: "Ouro", level: 3, minOrders: 15, minSpend: 800, color: "#ca8a04" },
  { name: "Diamante", level: 4, minOrders: 30, minSpend: 2000, color: "#0891b2" },
  { name: "VIP", level: 5, minOrders: 60, minSpend: 5000, color: "#7c3aed" },
];

const WEEK_HOURS = Array.from({ length: 7 }, (_, weekday) => ({
  weekday,
  opensAt: "08:00",
  closesAt: "22:00",
  isClosed: weekday === 0, // domingo fechado
}));

function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/800/800`;
}

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 10);

  console.log("→ Planos e configurações da plataforma");
  await prisma.plan.upsert({
    where: { name: "FREE" },
    update: {},
    create: { name: "FREE", description: "Para começar", price: 0, commissionRate: 12, maxProducts: 30 },
  });
  await prisma.plan.upsert({
    where: { name: "PRO" },
    update: {},
    create: { name: "PRO", description: "Para crescer", price: 49.9, commissionRate: 8, maxProducts: 500 },
  });
  await prisma.plan.upsert({
    where: { name: "BUSINESS" },
    update: {},
    create: { name: "BUSINESS", description: "Para escalar", price: 149.9, commissionRate: 5 },
  });
  await prisma.platformSetting.upsert({
    where: { key: "general" },
    update: {},
    create: {
      key: "general",
      value: { appName: "ComerziaHub", defaultCommission: 10, currency: "BRL" },
      description: "Configurações gerais",
    },
  });

  console.log("→ Usuários");
  const mkUser = (email: string, name: string, role: any) =>
    prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, role, passwordHash, status: "ACTIVE" },
    });

  const admin = await mkUser("admin@comerziahub.com", "Admin Geral", "ADMIN");
  await mkUser("moderador@comerziahub.com", "Moderador Social", "MODERATOR");
  const owner1 = await mkUser("loja@comerziahub.com", "Marina Lojista", "STORE_OWNER");
  const owner2 = await mkUser("loja2@comerziahub.com", "Rafael Comerciante", "STORE_OWNER");
  const employee = await mkUser("funcionario@comerziahub.com", "Júlia Funcionária", "STORE_EMPLOYEE");
  const customer = await mkUser("cliente@comerziahub.com", "Pedro Cliente", "CUSTOMER");
  const customer2 = await mkUser("cliente2@comerziahub.com", "Ana Compradora", "CUSTOMER");
  const courierUser = await mkUser("entregador@comerziahub.com", "Carlos Entregador", "COURIER");

  await prisma.courierProfile.upsert({
    where: { userId: courierUser.id },
    update: {},
    create: {
      userId: courierUser.id,
      status: "APPROVED",
      isOnline: true,
      vehicleType: "MOTORCYCLE",
      pixKey: "carlos@pix.com",
      documentsApproved: true,
      currentLat: -23.5605,
      currentLng: -46.6553,
    },
  });

  console.log("→ Categorias");
  const categoriesData = [
    { name: "Mercado", slug: "mercado", icon: "🛒" },
    { name: "Restaurantes", slug: "restaurantes", icon: "🍔" },
    { name: "Moda", slug: "moda", icon: "👕" },
    { name: "Eletrônicos", slug: "eletronicos", icon: "📱" },
    { name: "Beleza", slug: "beleza", icon: "💄" },
    { name: "Casa", slug: "casa", icon: "🏠" },
  ];
  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, icon: c.icon },
    });
    categories[c.slug] = cat.id;
  }

  console.log("→ Lojas e produtos");
  type ProductSpec = {
    name: string;
    slug: string;
    price: number;
    promo?: number;
    stock: number;
    category: string;
    featured?: boolean;
    variants?: { name: string; stock: number; priceModifier?: number }[];
  };

  const storesData: {
    slug: string;
    name: string;
    segment: string;
    description: string;
    ownerId: string;
    members?: string[];
    products: ProductSpec[];
  }[] = [
    {
      slug: "hortifruti-do-bairro",
      name: "Hortifruti do Bairro",
      segment: "Mercado",
      description: "Frutas, verduras e legumes fresquinhos todos os dias.",
      ownerId: owner1.id,
      members: [employee.id],
      products: [
        { name: "Banana Prata (kg)", slug: "banana-prata-kg", price: 6.9, stock: 120, category: "mercado", featured: true },
        { name: "Maçã Gala (kg)", slug: "maca-gala-kg", price: 9.9, promo: 7.9, stock: 80, category: "mercado", featured: true },
        { name: "Tomate Italiano (kg)", slug: "tomate-italiano-kg", price: 8.5, stock: 60, category: "mercado" },
        { name: "Alface Crespa (un)", slug: "alface-crespa", price: 3.5, stock: 40, category: "mercado" },
      ],
    },
    {
      slug: "lanchonete-sabor",
      name: "Lanchonete Sabor",
      segment: "Restaurante",
      description: "Os melhores lanches artesanais da região, com entrega rápida.",
      ownerId: owner2.id,
      products: [
        { name: "X-Burger Artesanal", slug: "x-burger-artesanal", price: 24.9, promo: 19.9, stock: 50, category: "restaurantes", featured: true },
        { name: "Batata Frita Cheddar", slug: "batata-cheddar", price: 18.0, stock: 50, category: "restaurantes" },
        { name: "Combo Casal", slug: "combo-casal", price: 59.9, stock: 30, category: "restaurantes", featured: true },
        { name: "Refrigerante Lata", slug: "refri-lata", price: 6.0, stock: 200, category: "restaurantes", variants: [
          { name: "Cola", stock: 80 },
          { name: "Guaraná", stock: 80 },
          { name: "Laranja", stock: 40 },
        ] },
      ],
    },
    {
      slug: "moda-urbana",
      name: "Moda Urbana",
      segment: "Moda",
      description: "Roupas e acessórios com estilo para o dia a dia.",
      ownerId: owner1.id,
      products: [
        { name: "Camiseta Básica", slug: "camiseta-basica", price: 49.9, promo: 39.9, stock: 100, category: "moda", featured: true, variants: [
          { name: "P", stock: 20 },
          { name: "M", stock: 40 },
          { name: "G", stock: 30 },
          { name: "GG", stock: 10 },
        ] },
        { name: "Moletom Canguru", slug: "moletom-canguru", price: 129.9, stock: 40, category: "moda" },
        { name: "Boné Aba Reta", slug: "bone-aba-reta", price: 59.9, stock: 60, category: "moda", featured: true },
        { name: "Meia Cano Alto", slug: "meia-cano-alto", price: 19.9, stock: 150, category: "moda" },
      ],
    },
  ];

  const createdProducts: { id: string; storeId: string; price: number; name: string }[] = [];
  const storeIds: string[] = [];

  for (const s of storesData) {
    const store = await prisma.store.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        segment: s.segment,
        description: s.description,
        ownerId: s.ownerId,
        status: "ACTIVE",
        isOpen: true,
        logoUrl: img(`${s.slug}-logo`),
        bannerUrl: img(`${s.slug}-banner`),
        lat: -23.5605,
        lng: -46.6553,
        ratingAvg: 4.6,
        ratingCount: 12,
        followerCount: 1,
        settings: {
          create: {
            cashbackEnabled: true,
            loyaltyEnabled: true,
            acceptsDelivery: true,
            acceptsPickup: true,
            deliveryFeeBase: 5,
            deliveryFeePerKm: 1.5,
            freeDeliveryThreshold: 80,
            prepTimeMinutes: 30,
            minOrderValue: 10,
          },
        },
        businessHours: { create: WEEK_HOURS },
        address: {
          create: {
            street: "Av. Paulista",
            number: "1000",
            district: "Bela Vista",
            city: "São Paulo",
            state: "SP",
            zip: "01310-100",
            lat: -23.5605,
            lng: -46.6553,
          },
        },
        loyaltyTiers: { create: TIERS },
        cashbackRules: {
          create: {
            name: "Cashback de boas-vindas",
            type: "PERCENT",
            value: 5,
            releaseAfterDays: 7,
            validityDays: 90,
            active: true,
          },
        },
        members: {
          create: [
            { userId: s.ownerId, role: "OWNER" },
            ...(s.members ?? []).map((uid) => ({ userId: uid, role: "STAFF" as const })),
          ],
        },
      },
    });
    storeIds.push(store.id);

    for (const p of s.products) {
      const product = await prisma.product.upsert({
        where: { storeId_slug: { storeId: store.id, slug: p.slug } },
        update: {},
        create: {
          storeId: store.id,
          categoryId: categories[p.category],
          name: p.name,
          slug: p.slug,
          description: `${p.name} — produto de demonstração da ${s.name}.`,
          basePrice: p.price,
          promoPrice: p.promo,
          stock: p.stock,
          isFeatured: p.featured ?? false,
          ratingAvg: 4.5,
          ratingCount: 8,
          salesCount: Math.floor(Math.random() * 50),
          images: { create: { url: img(p.slug), isPrimary: true } },
          ...(p.variants
            ? {
                variants: {
                  create: p.variants.map((v, i) => ({
                    name: v.name,
                    stock: v.stock,
                    priceModifier: v.priceModifier ?? 0,
                    position: i,
                  })),
                },
              }
            : {}),
        },
      });
      createdProducts.push({ id: product.id, storeId: store.id, price: p.promo ?? p.price, name: p.name });
    }
  }

  // ---- Atividade de exemplo (somente na primeira execução) ----
  const hasActivity = (await prisma.order.count()) > 0;
  if (hasActivity) {
    console.log("→ Atividade de exemplo já existe, pulando.");
    console.log("✔ Seed concluído.");
    return;
  }

  console.log("→ Seguidores, favoritos e avaliações");
  await prisma.storeFollow.createMany({
    data: storeIds.map((storeId) => ({ userId: customer.id, storeId })),
    skipDuplicates: true,
  });
  await prisma.productFavorite.createMany({
    data: createdProducts.slice(0, 3).map((p) => ({ userId: customer.id, productId: p.id })),
    skipDuplicates: true,
  });
  for (const p of createdProducts.slice(0, 4)) {
    await prisma.review.create({
      data: {
        authorId: customer2.id,
        type: "PRODUCT",
        rating: 5,
        comment: "Produto excelente, recomendo!",
        productId: p.id,
        storeId: p.storeId,
      },
    });
  }

  console.log("→ Pedidos de exemplo");
  const store1Products = createdProducts.filter((p) => p.storeId === storeIds[0]).slice(0, 2);
  const subtotal = store1Products.reduce((s, p) => s + p.price, 0);
  const deliveryFee = 7.5;
  const total = subtotal + deliveryFee;

  await prisma.order.create({
    data: {
      code: "CMZ-DEMO01",
      customerId: customer.id,
      storeId: storeIds[0],
      status: "DELIVERED",
      fulfillmentType: "DELIVERY",
      subtotal,
      deliveryFee,
      total,
      cashbackEarned: Math.round(subtotal * 0.05 * 100) / 100,
      deliveredAt: new Date(),
      items: {
        create: store1Products.map((p) => ({
          productId: p.id,
          name: p.name,
          unitPrice: p.price,
          quantity: 1,
          total: p.price,
          cashbackPercent: 5,
        })),
      },
      payment: { create: { method: "PIX", status: "PAID", amount: total, paidAt: new Date() } },
      statusHistory: {
        create: [
          { status: "PENDING" },
          { status: "ACCEPTED" },
          { status: "PREPARING" },
          { status: "OUT_FOR_DELIVERY" },
          { status: "DELIVERED" },
        ],
      },
      delivery: {
        create: {
          status: "DELIVERED",
          courierId: (await prisma.courierProfile.findUnique({ where: { userId: courierUser.id } }))!.id,
          distanceKm: 3.2,
          fee: deliveryFee,
          courierEarnings: 6,
          platformFee: 1.5,
          estimatedMinutes: 35,
          deliveredAt: new Date(),
        },
      },
    },
  });

  await prisma.cashbackWallet.upsert({
    where: { userId_storeId: { userId: customer.id, storeId: storeIds[0] } },
    update: { balance: Math.round(subtotal * 0.05 * 100) / 100 },
    create: { userId: customer.id, storeId: storeIds[0], balance: Math.round(subtotal * 0.05 * 100) / 100 },
  });
  await prisma.loyaltyStatus.upsert({
    where: { userId_storeId: { userId: customer.id, storeId: storeIds[0] } },
    update: {},
    create: { userId: customer.id, storeId: storeIds[0], totalOrders: 1, totalSpend: total },
  });

  // Pedido pendente (para o painel da loja)
  const store2Products = createdProducts.filter((p) => p.storeId === storeIds[1]).slice(0, 1);
  if (store2Products.length) {
    const sub2 = store2Products[0].price;
    await prisma.order.create({
      data: {
        code: "CMZ-DEMO02",
        customerId: customer2.id,
        storeId: storeIds[1],
        status: "PENDING",
        fulfillmentType: "DELIVERY",
        subtotal: sub2,
        deliveryFee: 6,
        total: sub2 + 6,
        items: { create: { productId: store2Products[0].id, name: store2Products[0].name, unitPrice: sub2, quantity: 1, total: sub2 } },
        payment: { create: { method: "CASH_ON_DELIVERY", status: "PENDING", amount: sub2 + 6 } },
        statusHistory: { create: { status: "PENDING" } },
        delivery: { create: { status: "PENDING", distanceKm: 2.1, fee: 6, courierEarnings: 4.8, platformFee: 1.2, estimatedMinutes: 30 } },
      },
    });
  }

  console.log("→ Publicações da rede social");
  const post1 = await prisma.post.create({
    data: {
      authorId: owner1.id,
      storeId: storeIds[0],
      type: "PROMOTION",
      content: "🍏 Semana da fruta! Maçã Gala com 20% de desconto. Aproveite e ainda ganhe 5% de cashback!",
      images: { create: { url: img("promo-frutas") } },
    },
  });
  await prisma.post.create({
    data: {
      authorId: owner2.id,
      storeId: storeIds[1],
      type: "PRODUCT",
      content: "Novo X-Burger Artesanal no precinho de lançamento! 🍔",
      productId: createdProducts.find((p) => p.name.includes("X-Burger"))?.id,
    },
  });
  await prisma.post.create({
    data: {
      authorId: customer.id,
      type: "TEXT",
      content: "Comprei na Hortifruti do Bairro e a entrega foi super rápida. Recomendo! 🚀",
    },
  });

  await prisma.postLike.createMany({
    data: [
      { userId: customer.id, postId: post1.id },
      { userId: customer2.id, postId: post1.id },
    ],
    skipDuplicates: true,
  });
  await prisma.post.update({ where: { id: post1.id }, data: { likeCount: 2 } });
  await prisma.comment.create({
    data: { postId: post1.id, authorId: customer.id, content: "Vou aproveitar!" },
  });
  await prisma.post.update({ where: { id: post1.id }, data: { commentCount: 1 } });

  console.log("→ Cupons");
  await prisma.coupon.createMany({
    data: [
      { storeId: storeIds[0], code: "BEMVINDO10", description: "10% na primeira compra", type: "PERCENT", value: 10, minOrderValue: 20, active: true },
      { storeId: storeIds[1], code: "FRETEGRATIS", description: "Frete grátis acima de R$ 50", type: "FREE_SHIPPING", value: 0, minOrderValue: 50, active: true },
      { storeId: storeIds[2], code: "MODA15", description: "R$ 15 de desconto em moda", type: "FIXED", value: 15, minOrderValue: 80, active: true },
    ],
    skipDuplicates: true,
  });

  console.log("→ Emblemas de fidelidade");
  const badgeFiel = await prisma.badge.create({
    data: { storeId: storeIds[0], name: "Cliente Fiel", description: "Comprou mais de uma vez nesta loja.", iconUrl: img("badge-fiel") },
  });
  const badgePioneiro = await prisma.badge.create({
    data: { name: "Pioneiro", description: "Entre os primeiros usuários da plataforma.", iconUrl: img("badge-pioneiro") },
  });
  await prisma.userBadge.createMany({
    data: [
      { userId: customer.id, badgeId: badgeFiel.id },
      { userId: customer.id, badgeId: badgePioneiro.id },
      { userId: customer2.id, badgeId: badgePioneiro.id },
    ],
    skipDuplicates: true,
  });

  console.log("→ Transações de cashback");
  const order1 = await prisma.order.findUnique({ where: { code: "CMZ-DEMO01" } });
  if (order1) {
    await prisma.cashbackTransaction.create({
      data: {
        userId: customer.id,
        storeId: storeIds[0],
        orderId: order1.id,
        type: "EARNED",
        status: "AVAILABLE",
        amount: order1.cashbackEarned,
        availableAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("→ Conversa comprador × vendedor");
  await prisma.conversation.create({
    data: {
      participants: { create: [{ userId: customer.id }, { userId: owner2.id }] },
      messages: {
        create: [
          { senderId: customer.id, content: "Olá! O X-Burger Artesanal ainda está na promoção?", createdAt: new Date(Date.now() - 4 * 60000) },
          { senderId: owner2.id, content: "Oi! Sim 😄 válida até o fim de semana, com 5% de cashback.", createdAt: new Date(Date.now() - 3 * 60000) },
          { senderId: customer.id, content: "Perfeito! Vou pedir agora mesmo. Obrigado!", createdAt: new Date(Date.now() - 2 * 60000) },
          { senderId: owner2.id, content: "Maravilha! Qualquer dúvida é só chamar. 🚀", createdAt: new Date(Date.now() - 1 * 60000) },
        ],
      },
    },
  });

  console.log("✔ Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
