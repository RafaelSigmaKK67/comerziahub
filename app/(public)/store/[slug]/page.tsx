import Link from "next/link";
import { notFound } from "next/navigation";
import { Store as StoreIcon, MapPin, Clock, Users, Package, Gift } from "lucide-react";
import { ProductCard } from "@/components/commerce/product-card";
import { RatingStars } from "@/components/commerce/rating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SmartImage } from "@/components/ui/smart-image";
import { MapEmbed } from "@/components/maps/map-embed";
import { getStoreBySlug } from "@/services/catalog";
import { isFollowingStore } from "@/services/social";
import { getCurrentUser } from "@/lib/session";
import { toggleStoreFollow } from "@/actions/social";

export const dynamic = "force-dynamic";

const WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const user = await getCurrentUser();
  const following = user ? await isFollowingStore(user.id, store.id) : false;

  return (
    <div>
      {/* Banner (capa) — contido na própria faixa, nunca invade o conteúdo */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-r from-brand-500 to-brand-700 sm:h-56">
        {store.bannerUrl && (
          <SmartImage src={store.bannerUrl} alt="" fallbackText={store.name} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="container-page">
        {/* Cabeçalho: só o logo sobrepõe a capa; nome/avaliação ficam sempre
            abaixo do banner (texto sobre foto clara ficava ilegível). */}
        <div className="relative z-10 -mt-12 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-brand-100 text-brand-600 shadow-card">
              <SmartImage src={store.logoUrl} alt={store.name} iconName="store" className="h-full w-full object-cover" />
            </span>
            <div className="pt-14">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{store.name}</h1>
                <Badge className={store.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}>
                  {store.isOpen ? "Aberta" : "Fechada"}
                </Badge>
              </div>
              {store.segment && <p className="text-sm text-slate-500">{store.segment}</p>}
              <div className="mt-1">
                <RatingStars value={store.ratingAvg} count={store.ratingCount} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:self-end sm:pb-1">
            {user ? (
              <form action={toggleStoreFollow.bind(null, store.id)}>
                <Button variant={following ? "outline" : "primary"} type="submit">
                  {following ? "Seguindo" : "Seguir"}
                </Button>
              </form>
            ) : (
              <Link href={`/login?callbackUrl=/store/${store.slug}`}>
                <Button variant="primary">Seguir</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Métricas */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric icon={Users} label="Seguidores" value={store.followerCount} />
          <Metric icon={Package} label="Produtos" value={store._count.products} />
          <Metric icon={StoreIcon} label="Avaliações" value={store._count.reviews} />
          <Metric
            icon={Gift}
            label="Cashback"
            value={store.settings?.cashbackEnabled ? "Ativo" : "—"}
          />
        </div>

        {store.description && (
          <p className="mt-6 max-w-3xl text-slate-600">{store.description}</p>
        )}

        {/* Produtos */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Produtos</h2>
          {store.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {store.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Package} title="Esta loja ainda não tem produtos publicados." />
          )}
        </section>

        {/* Sobre / horários */}
        <section className="mb-12 mt-10 grid gap-6 lg:grid-cols-2">
          {store.businessHours.length > 0 && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <Clock className="h-4 w-4" /> Horário de funcionamento
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {store.businessHours.map((h) => (
                  <li key={h.id} className="flex justify-between text-slate-600">
                    <span>{WEEK[h.weekday]}</span>
                    <span>{h.isClosed ? "Fechado" : `${h.opensAt} – ${h.closesAt}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {store.address && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <MapPin className="h-4 w-4" /> Localização
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                {[store.address.street, store.address.number, store.address.district, store.address.city, store.address.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </section>

        {store.lat != null && store.lng != null && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Mapa e área de entrega</h2>
            <div className="h-72 overflow-hidden rounded-2xl border border-slate-200">
              <MapEmbed
                lat={store.lat}
                lng={store.lng}
                label={store.name}
                radiusKm={store.settings?.maxDeliveryRadiusKm ?? undefined}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
