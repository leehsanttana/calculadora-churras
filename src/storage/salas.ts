import type { EntradaChurrasco } from "@/core/tipos";

// Índice local das salas que ESTE dispositivo criou (é dono). Como o servidor
// não tem login, guardamos aqui o suficiente para listar em "Meus churrascos",
// reabrir a calculadora e editar/excluir a sala.
// Tolerante a ambientes sem window (SSR) e a dados corrompidos.

const CHAVE = "churras:salas";

export interface SalaSalva {
  code: string;
  nome: string;
  criadoEm: string; // ISO date
  entrada: EntradaChurrasco;
  hostToken: string;
  participanteId: string;
}

function disponivel(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** Lê todas as salas salvas. Retorna [] se não houver ou em erro. */
export function listarSalas(): SalaSalva[] {
  if (!disponivel()) return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as SalaSalva[]) : [];
  } catch {
    return [];
  }
}

function persistir(lista: SalaSalva[]): void {
  if (!disponivel()) return;
  window.localStorage.setItem(CHAVE, JSON.stringify(lista));
}

/** Busca uma sala salva pelo código. */
export function buscarSala(code: string): SalaSalva | undefined {
  return listarSalas().find((s) => s.code === code);
}

/**
 * Salva ou atualiza uma sala no índice (upsert por `code`). Itens novos vão
 * para o topo; ao atualizar, o registro mantém sua posição.
 */
export function salvarSala(sala: SalaSalva): void {
  const lista = listarSalas();
  const i = lista.findIndex((s) => s.code === sala.code);
  if (i >= 0) lista[i] = sala;
  else lista.unshift(sala);
  persistir(lista);
}

/** Remove uma sala do índice pelo código. */
export function removerSala(code: string): void {
  persistir(listarSalas().filter((s) => s.code !== code));
}
