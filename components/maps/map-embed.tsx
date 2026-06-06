"use client";

import dynamic from "next/dynamic";

// Carrega o mapa só no cliente (Leaflet acessa `window`).
const StoreMap = dynamic(() => import("./store-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400 dark:bg-slate-800/40">
      Carregando mapa…
    </div>
  ),
});

export function MapEmbed(props: {
  lat: number;
  lng: number;
  label?: string;
  radiusKm?: number;
}) {
  return <StoreMap {...props} />;
}
