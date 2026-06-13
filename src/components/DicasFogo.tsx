import { DICAS_FOGO } from "@/data/dicas-fogo";

/** Lista de dicas de acender a churrasqueira. */
export default function DicasFogo({
  titulo = "Na hora de acender a churrasqueira",
}: {
  titulo?: string;
}) {
  return (
    <section className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-950/30">
      <h3 className="flex items-center gap-2 font-heading text-xl uppercase text-amber-900 dark:text-amber-200">
        🔥 {titulo}
      </h3>
      <ul className="mt-2 flex flex-col gap-2">
        {DICAS_FOGO.map((dica) => (
          <li
            key={dica}
            className="flex gap-2 text-sm text-amber-900/80 dark:text-amber-100/80"
          >
            <span className="text-amber-600 dark:text-amber-400">•</span>
            {dica}
          </li>
        ))}
      </ul>
    </section>
  );
}
