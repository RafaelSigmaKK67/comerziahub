import Link from "next/link";
import { notFound } from "next/navigation";
import { Store as StoreIcon, Gift, ShieldCheck, Truck } from "lucide-react";
import { AddToCart } from "@/components/commerce/add-to-cart";
import { RatingStars } from "@/components/commerce/rating";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { getProductById } from "@/services/catalog";
import { effectivePrice, formatCurrency, toNumber, formatQuantity } from "@/lib/utils";
import { UNIT_LABELS, FRACTIONAL_UNITS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const { price, isPromo, base } = effectivePrice(product);
  const images = product.images.length
    ? product.images
    : [{ id: "ph", url: "", alt: product.name }];
  const outOfStock =
    product.status === "OUT_OF_STOCK" ||
    (product.manageStock &&
      product.variants.length === 0 &&
      toNumber(product.stock) <= 0);

  return (
    <div className="container-page py-8">
      <nav aria-label="Trilha de navegação" className="mb-4 text-sm text-slate-500">
        <Link href="/marketplace" className="hover:underline">Marketplace</Link>
        {" / "}
        <Link href={`/store/${product.store.slug}`} className="hover:underline">
          {product.store.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galeria */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <SmartImage src={images[0].url} alt={product.name} fallbackText={product.name} className="h-full w-full object-contain" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((im) => (
                <div key={im.id} className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <SmartImage src={im.url} alt="" fallbackText={product.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações */}
        <div>
          <Link
            href={`/store/${product.store.slug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"
          >
            <StoreIcon className="h-4 w-4" /> {product.store.name}
          </Link>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3">
            <RatingStars value={product.ratingAvg} count={product.ratingCount} />
            {product.category && <Badge>{product.category.name}</Badge>}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className={isPromo ? "text-3xl font-extrabold text-accent-600" : "text-3xl font-extrabold text-slate-900"}>
              {formatCurrency(price)}
              {FRACTIONAL_UNITS.includes(product.unit) && (
                <span className="text-base font-medium text-slate-400"> /{UNIT_LABELS[product.unit]}</span>
              )}
            </span>
            {isPromo && (
              <>
                <span className="text-lg text-slate-400 line-through">{formatCurrency(base)}</span>
                <Badge className="bg-accent-700 text-white">Promoção</Badge>
              </>
            )}
          </div>

          {!outOfStock && product.variants.length === 0 && product.manageStock && (
            <p className="mt-1 text-sm text-slate-500">
              {formatQuantity(product.stock, UNIT_LABELS[product.unit])} em estoque
            </p>
          )}

          <div className="mt-6">
            {outOfStock ? (
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
                Produto esgotado no momento.
              </div>
            ) : (
              <AddToCart
                productId={product.id}
                step={toNumber(product.unitStep) || 1}
                unit={UNIT_LABELS[product.unit]}
                variants={product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  stock: toNumber(v.stock),
                }))}
              />
            )}
          </div>

          {/* Selos */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
            {product.store.settings?.cashbackEnabled && (
              <div className="rounded-xl border border-slate-200 p-3">
                <Gift className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-1">Cashback ativo</p>
              </div>
            )}
            <div className="rounded-xl border border-slate-200 p-3">
              <Truck className="mx-auto h-5 w-5 text-brand-600" />
              <p className="mt-1">Delivery</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <ShieldCheck className="mx-auto h-5 w-5 text-brand-600" />
              <p className="mt-1">Compra protegida</p>
            </div>
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="font-semibold text-slate-900">Descrição</h2>
              <p className="mt-2 whitespace-pre-line text-slate-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Avaliações */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">
          Avaliações ({product._count.reviews})
        </h2>
        {product.reviews.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {product.reviews.map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center gap-3">
                  <Avatar src={r.author.image} name={r.author.name} size={36} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{r.author.name}</p>
                    <RatingStars value={r.rating} size={12} />
                  </div>
                </div>
                {r.comment && <p className="mt-3 text-sm text-slate-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Ainda sem avaliações para este produto.</p>
        )}
      </section>
    </div>
  );
}
