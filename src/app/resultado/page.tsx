import type { Metadata } from "next";
import { Suspense } from "react";
import ResultadoCliente from "@/components/ResultadoCliente";

export const metadata: Metadata = {
  title: "Seu churrasco",
  description:
    "Veja a quantidade ideal de carne, extras, acompanhamentos e bebidas do seu churrasco, com rateio entre os amigos.",
};

export default function ResultadoPage() {
  return (
    <Suspense fallback={null}>
      <ResultadoCliente />
    </Suspense>
  );
}
