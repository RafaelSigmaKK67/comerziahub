import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./rating";
import { cn, formatCurrency, effectivePrice } from "@/lib/utils";

type Money = number | string | { toString(): string };

export type ProductCardData = {
  id: string;
  name: string;
  basePrice: Money;
  promoPrice?: Money | null;
  promoStartsAt?: Date | null;
  promoEndsAt?: Date | null;
  ratingAvg?: number;
  ratingCount?: number;
  status?: string;
  images?: { url: string }[];
  store?: { name: string; slug: string } | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { price, isPromo, base } = effectivePrice(product);
  const img = product.images?.[0]?.url;
  const out = product.status === "OUT_OF_STOCK";

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:shadow-soft"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 text-3xl font-bold text-brand-300">
            {product.name[0]}
          </div>
        )}
        {isPromo && (
          <Badge className="absolute left-2 top-2 bg-accent-500 text-white">
            Promoção
          </Badge>
        )}
        {out && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-slate-600">
            Esgotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        {product.store && (
          <span className="truncate text-xs text-slate-400">
            {product.store.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-slate-800">
          {product.name}
        </h3>
        {typeof product.ratingAvg === "number" && product.ratingCount ? (
          <div className="mt-1">
            <RatingStars value={product.ratingAvg} count={product.ratingCount} size={12} />
          </div>
        ) : null}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className={cn("text-base font-bold", isPromo ? "text-accent-600" : "text-slate-900")}>
              {formatCurrency(price)}
            </span>
            {isPromo && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(base)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
