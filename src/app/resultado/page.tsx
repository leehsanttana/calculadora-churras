import { Suspense } from "react";
import ResultadoCliente from "@/components/ResultadoCliente";

export default function ResultadoPage() {
  return (
    <Suspense fallback={null}>
      <ResultadoCliente />
    </Suspense>
  );
}
