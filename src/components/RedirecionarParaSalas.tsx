"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { listarSalas } from "@/storage/salas";

/**
 * Na home: se este dispositivo já tem listas (salas) criadas, leva direto para
 * "Minhas listas". Não renderiza nada — só decide o redirecionamento após a
 * hidratação (localStorage só existe no cliente).
 */
export default function RedirecionarParaSalas() {
  const router = useRouter();
  useEffect(() => {
    if (listarSalas().length > 0) router.replace("/meus-churrascos");
  }, [router]);
  return null;
}
