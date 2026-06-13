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

export const metadata: Metadata = {
  title: "Calculadora de Churrasco",
  description:
    "Planeje a quantidade certa de carne, acompanhamentos e bebidas do seu churrasco — com dicas de cortes por perfil.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Churras",
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
