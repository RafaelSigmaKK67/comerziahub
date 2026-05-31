import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { APP } from "@/lib/constants";

const bullets = [
  "Marketplace multi-lojas com busca e filtros",
  "Delivery com rastreio e área do entregador",
  "Cashback e programa de fidelidade por loja",
  "Rede social comercial integrada",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 to-brand-900 p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold">ComerziaHub</span>
        </Link>
        <div>
          <h2 className="max-w-sm text-3xl font-bold leading-tight">
            Venda, entregue e conecte. Tudo em um só lugar.
          </h2>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-brand-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-4 w-4" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-brand-200">{APP.description}</p>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
