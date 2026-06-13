import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-7 overflow-hidden px-6 py-16 text-center">
      {/* Faixa tricolor — identidade brasileira. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2.5 bg-[linear-gradient(90deg,var(--c-primary)_0_33%,var(--c-accent)_33%_66%,var(--c-secondary)_66%_100%)]"
      />

      <span
        className="-rotate-6 text-7xl drop-shadow-sm"
        role="img"
        aria-label="Churrasco"
      >
        🔥
      </span>

      <span className="-rotate-1 rounded-full border-2 border-foreground bg-accent px-4 py-1 text-sm font-bold uppercase tracking-wide text-black shadow-pop-sm">
        🏆 Edição Copa do Mundo
      </span>

      <h1 className="font-heading text-6xl uppercase leading-[0.9] sm:text-7xl">
        Sonochurras
      </h1>

      <p className="-mt-3 font-heading text-xl uppercase tracking-wide text-primary-text">
        Calculadora de churrasco
      </p>

      <p className="max-w-md text-balance text-base text-foreground/70">
        Ano de Copa é ano de churrasco com a galera. Descubra a quantidade certa
        de carne, acompanhamentos e bebidas — sem chute, sem desperdício, e
        ainda divida a conta entre os amigos.
      </p>

      <Link
        href="/calcular"
        className="rounded-full border-2 border-foreground bg-primary px-8 py-3.5 text-lg font-semibold text-white shadow-pop transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Começar 🔥
      </Link>

      <Link
        href="/meus-churrascos"
        className="font-semibold text-foreground/60 underline-offset-4 hover:underline"
      >
        Ver meus churrascos salvos
      </Link>
    </main>
  );
}
