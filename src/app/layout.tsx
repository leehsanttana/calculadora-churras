import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ModeToggle from "@/components/ModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fonte de display condensada all-caps — base do estilo maximalist.
const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

// URL pública do site (usada para resolver as imagens OG como absolutas).
// Troque aqui se mudar para um domínio próprio.
const SITE_URL = "https://sonochurras.pages.dev";

const TITULO = "Calculadora de Churrasco — quanto de carne por pessoa";
const DESCRICAO =
  "Descubra a quantidade certa de carne, acompanhamentos e bebidas do seu churrasco — por pessoa, com dicas de cortes, rateio entre amigos e lista pronta pra compartilhar no WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITULO,
    template: "%s · Calculadora de Churrasco",
  },
  description: DESCRICAO,
  applicationName: "Calculadora de Churrasco",
  keywords: [
    "calculadora de churrasco",
    "quantidade de carne por pessoa",
    "carne por pessoa churrasco",
    "quanto de carne no churrasco",
    "cortes de carne",
    "acompanhamentos churrasco",
    "rateio churrasco",
    "churrasco copa do mundo",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Churras",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Calculadora de Churrasco",
    title: TITULO,
    description: DESCRICAO,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Calculadora de Churrasco — quanto de carne por pessoa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#009c3b",
  viewportFit: "cover",
};

// Aplica o modo salvo antes da pintura (padrão = claro). Evita flash no escuro.
const modeInit = `(function(){try{var m=localStorage.getItem('mode')||'light';var dark=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: modeInit }} />
        <div className="fixed right-2 top-[max(0.5rem,env(safe-area-inset-top))] z-50">
          <ModeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
