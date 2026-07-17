import Link from "next/link";
import {
  Search,
  Boxes,
  Truck,
  Store as StoreIcon,
  Users,
  Gift,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StoreCard } from "@/components/commerce/store-card";
import { ProductCard } from "@/components/commerce/product-card";
import {
  getActiveStores,
  getFeaturedProducts,
  getBestSellers,
  listCategories,
} from "@/services/catalog";

export const dynamic = "force-dynamic";

const pillars = [
  { icon: Boxes, title: "Estoque", desc: "Controle de produtos, variações e movimentações." },
  { icon: Truck, title: "Delivery", desc: "Entregas com rastreio, taxa e área do entregador." },
  { icon: StoreIcon, title: "Marketplace", desc: "Várias lojas, busca, filtros e destaques." },
  { icon: Users, title: "Rede social", desc: "Feed, seguidores, mensagens e publicações." },
  { icon: Gift, title: "Cashback", desc: "Regras por loja, saldo e uso em compras." },
  { icon: Award, title: "Fidelidade", desc: "Níveis, emblemas e benefícios exclusivos." },
];

export default async function HomePage() {
  const [stores, featured, bestSellers, categories] = await Promise.all([
    getActiveStores(8),
    getFeaturedProducts(10),
    getBestSellers(10),
    listCategories(),
  ]);
  const highlights = featured.length > 0 ? featured : bestSellers;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> Estoque · Delivery · Marketplace · Social
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Venda, entregue e conecte. Tudo em um só lugar.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-brand-100">
              A plataforma completa para lojas, vendedores, compradores e
              entregadores — com cashback, fidelidade e rede social comercial.
            </p>

            <form action="/marketplace" className="mt-6 flex max-w-md gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  aria-label="Buscar produtos e lojas"
                  placeholder="O que você procura hoje?"
                  className="h-12 w-full rounded-xl border-0 pl-10 pr-3 text-slate-900 outline-none ring-2 ring-transparent focus:ring-accent-400"
                />
              </div>
              <button className={buttonVariants({ variant: "accent", size: "lg" })}>
                Buscar
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register?role=STORE_OWNER" className={buttonVariants({ variant: "secondary" })}>
                Abrir minha loja
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 hover:text-white"
              >
                Explorar marketplace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="hidden items-center justify-center md:flex">
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              {pillars.slice(0, 4).map((p) => (
                <div key={p.title} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p.icon className="h-7 w-7 text-accent-300" />
                  <p className="mt-3 font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm text-brand-100">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="container-page py-14">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Um sistema, todos os módulos
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-500">
          Tudo que uma operação de comércio precisa, integrado de ponta a ponta.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="container-page pb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/marketplace?categoryId=${c.id}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                {c.name}
                <span className="ml-1 text-xs text-slate-400">({c._count.products})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LOJAS EM DESTAQUE */}
      <section className="container-page py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lojas em destaque</h2>
            <p className="text-sm text-slate-500">As mais bem avaliadas da plataforma.</p>
          </div>
          <Link href="/marketplace" className="text-sm font-medium text-brand-600 hover:underline">
            Ver todas
          </Link>
        </div>
        {stores.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Nenhuma loja ainda. Rode o seed (<code>npm run db:seed</code>) ou{" "}
            <Link href="/register?role=STORE_OWNER" className="text-brand-600 underline">
              abra a primeira loja
            </Link>
            .
          </p>
        )}
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      {highlights.length > 0 && (
        <section className="container-page py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Destaques</h2>
              <p className="text-sm text-slate-500">Produtos selecionados e mais vendidos.</p>
            </div>
            <Link href="/marketplace" className="text-sm font-medium text-brand-600 hover:underline">
              Ver mais
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {highlights.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page py-14">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
            <div>
              <ShieldCheck className="h-8 w-8 text-accent-300" />
              <h3 className="mt-3 text-xl font-bold">Abra sua loja gratuitamente</h3>
              <p className="mt-1 text-brand-100">
                Cadastre produtos, controle estoque, receba pedidos e fidelize clientes.
              </p>
            </div>
            <Link href="/register?role=STORE_OWNER" className={buttonVariants({ variant: "accent" }) + " mt-6 w-fit"}>
              Começar agora
            </Link>
          </div>
          <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-8 text-white">
            <div>
              <Truck className="h-8 w-8 text-accent-300" />
              <h3 className="mt-3 text-xl font-bold">Seja um entregador</h3>
              <p className="mt-1 text-slate-300">
                Aceite entregas, acompanhe ganhos e gerencie sua disponibilidade.
              </p>
            </div>
            <Link href="/register?role=COURIER" className={buttonVariants({ variant: "outline" }) + " mt-6 w-fit"}>
              Quero entregar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
