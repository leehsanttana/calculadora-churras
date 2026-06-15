import type { Metadata } from "next";
import { Suspense } from "react";
import SalaCliente from "@/components/SalaCliente";

export const metadata: Metadata = {
  title: "Sala de rateio",
  description: "Veja a lista do churrasco e informe o que você vai levar.",
};

export default function SalaPage() {
  return (
    <Suspense fallback={null}>
      <SalaCliente />
    </Suspense>
  );
}
