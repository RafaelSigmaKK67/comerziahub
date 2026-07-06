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
  icons: {
    apple: "/icon-192.png",
  },
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
      <head>
        {/* Aplica o tema antes da pintura para evitar "flash". Padrão: escuro. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();",
          }}
        />
      </head>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
