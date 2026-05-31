import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { APP } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP.name} — Estoque, Delivery, Marketplace e Rede Social Comercial`,
    template: `%s · ${APP.name}`,
  },
  description: APP.description,
  applicationName: APP.name,
  keywords: [
    "marketplace",
    "delivery",
    "estoque",
    "cashback",
    "fidelidade",
    "rede social comercial",
    "lojas online",
  ],
  authors: [{ name: APP.name }],
  openGraph: {
    title: APP.name,
    description: APP.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b2ff0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
