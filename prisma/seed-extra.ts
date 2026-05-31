/**
 * Top-up não destrutivo: adiciona cupons, emblemas, transação de cashback e
 * uma conversa comprador×vendedor a um banco já semeado (sem apagar dados).
 * Uso: npm run db:seed:extra
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const img = (s: string) => `https://picsum.photos/seed/${s}/800/800`;

async function main() {
  const stores = await prisma.store.findMany({ select: { id: true, slug: true } });
  const bySlug = Object.fromEntries(stores.map((s) => [s.slug, s.id]));
  const hort = bySlug["hortifruti-do-bairro"];
  const lanche = bySlug["lanchonete-sabor"];
  const moda = bySlug["moda-urbana"];

  const customer = await prisma.user.findUnique({ where: { email: "cliente@comerziahub.com" } });
  const customer2 = await prisma.user.findUnique({ where: { email: "cliente2@comerziahub.com" } });
  const owner2 = await prisma.user.findUnique({ where: { email: "loja2@comerziahub.com" } });

  if (hort && lanche && moda) {
    await prisma.coupon.createMany({
      data: [
        { storeId: hort, code: "BEMVINDO10", description: "10% na primeira compra", type: "PERCENT", value: 10, minOrderValue: 20, active: true },
        { storeId: lanche, code: "FRETEGRATIS", description: "Frete grátis acima de R$ 50", type: "FREE_SHIPPING", value: 0, minOrderValue: 50, active: true },
        { storeId: moda, code: "MODA15", description: "R$ 15 de desconto em moda", type: "FIXED", value: 15, minOrderValue: 80, active: true },
      ],
      skipDuplicates: true,
    });
    console.log("✓ cupons");
  }

  if ((await prisma.badge.count()) === 0 && customer && customer2) {
    const fiel = await prisma.badge.create({ data: { storeId: hort, name: "Cliente Fiel", description: "Comprou mais de uma vez nesta loja.", iconUrl: img("badge-fiel") } });
    const pio = await prisma.badge.create({ data: { name: "Pioneiro", description: "Entre os primeiros usuários da plataforma.", iconUrl: img("badge-pioneiro") } });
    await prisma.userBadge.createMany({
      data: [
        { userId: customer.id, badgeId: fiel.id },
        { userId: customer.id, badgeId: pio.id },
        { userId: customer2.id, badgeId: pio.id },
      ],
      skipDuplicates: true,
    });
    console.log("✓ emblemas");
  }

  if ((await prisma.cashbackTransaction.count()) === 0 && customer && hort) {
    const order1 = await prisma.order.findUnique({ where: { code: "CMZ-DEMO01" } });
    if (order1) {
      await prisma.cashbackTransaction.create({
        data: {
          userId: customer.id, storeId: hort, orderId: order1.id, type: "EARNED", status: "AVAILABLE",
          amount: order1.cashbackEarned, availableAt: new Date(), expiresAt: new Date(Date.now() + 90 * 864e5),
        },
      });
      console.log("✓ cashback");
    }
  }

  if ((await prisma.conversation.count()) === 0 && customer && owner2) {
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
    console.log("✓ conversa");
  }

  console.log("Top-up concluído.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
