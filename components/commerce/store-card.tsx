import Link from "next/link";
import { Store as StoreIcon, MapPin } from "lucide-react";
import { RatingStars } from "./rating";
import { Badge } from "@/components/ui/badge";

export type StoreCardData = {
  id: string;
  slug: string;
  name: string;
  segment?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  ratingAvg?: number;
  ratingCount?: number;
  isOpen?: boolean;
  city?: string | null;
  address?: { city?: string | null } | null;
};

export function StoreCard({ store }: { store: StoreCardData }) {
  const city = store.city ?? store.address?.city;
  return (
    <Link
      href={`/store/${store.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:shadow-soft"
    >
      <div className="relative h-24 bg-gradient-to-r from-brand-500 to-brand-700">
        {store.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={store.bannerUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="px-4 pb-4">
        <div className="-mt-7 mb-2 flex items-end justify-between">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-brand-100 text-brand-600 shadow-sm">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
            ) : (
              <StoreIcon className="h-6 w-6" />
            )}
          </span>
          <Badge
            className={
              store.isOpen
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-600"
            }
          >
            {store.isOpen ? "Aberta" : "Fechada"}
          </Badge>
        </div>
        <h3 className="font-semibold text-slate-900">{store.name}</h3>
        {store.segment && (
          <p className="text-xs text-slate-500">{store.segment}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <RatingStars value={store.ratingAvg ?? 0} count={store.ratingCount ?? 0} size={13} />
          {city && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3" /> {city}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
