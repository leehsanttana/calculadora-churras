import Link from "next/link";
import CalculadoraForm from "@/components/CalculadoraForm";
import { parseEntrada } from "@/core/serial";

export default async function CalcularPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const inicial = parseEntrada(await searchParams);
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-8 px-6 py-10">
      <header className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          ← Voltar
        </Link>
        <Link
          href="/meus-churrascos"
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          Meus churrascos
        </Link>
      </header>

      <div className="text-center">
        <h1 className="font-heading text-4xl uppercase">Monte seu churrasco</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Responda rápido e veja a quantidade ideal.
        </p>
      </div>

      <CalculadoraForm inicial={inicial} />
    </main>
  );
}
