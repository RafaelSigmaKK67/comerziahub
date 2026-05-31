/**
 * Utilitários de delivery — cálculo de distância, taxa e tempo estimado.
 * A integração com mapas reais (Google/Mapbox) entra no roadmap; por ora
 * usamos a fórmula de Haversine sobre lat/lng cadastrados.
 */

export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6371; // raio da Terra em km
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(R * 2 * Math.asin(Math.sqrt(h)) * 10) / 10;
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function calcDeliveryFee(opts: {
  distanceKm: number;
  base: number;
  perKm: number;
  subtotal?: number;
  freeThreshold?: number | null;
}): number {
  const { distanceKm, base, perKm, subtotal = 0, freeThreshold } = opts;
  if (freeThreshold && subtotal >= freeThreshold) return 0;
  const fee = base + perKm * distanceKm;
  return Math.max(0, Math.round(fee * 100) / 100);
}

export function estimateMinutes(distanceKm: number, prepMinutes = 20): number {
  const avgKmh = 22; // velocidade média urbana
  const travel = (distanceKm / avgKmh) * 60;
  return Math.round(prepMinutes + travel);
}
