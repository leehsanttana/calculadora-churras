import type { ChurrascoSalvo, EntradaChurrasco } from "@/core/tipos";

// Persistência local dos churrascos salvos pelo usuário (localStorage).
// Tolerante a ambientes sem window (SSR) e a dados corrompidos.

const CHAVE = "churras:salvos";

function disponivel(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** Lê todos os churrascos salvos. Retorna [] se não houver ou em erro. */
export function listarChurrascos(): ChurrascoSalvo[] {
  if (!disponivel()) return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as ChurrascoSalvo[]) : [];
  } catch {
    return [];
  }
}

function persistir(lista: ChurrascoSalvo[]): void {
  if (!disponivel()) return;
  window.localStorage.setItem(CHAVE, JSON.stringify(lista));
}

function gerarId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Salva um novo churrasco e retorna o registro criado. */
export function salvarChurrasco(
  nome: string,
  entrada: EntradaChurrasco,
): ChurrascoSalvo {
  const registro: ChurrascoSalvo = {
    id: gerarId(),
    nome: nome.trim() || "Churrasco sem nome",
    criadoEm: new Date().toISOString(),
    entrada,
  };
  persistir([registro, ...listarChurrascos()]);
  return registro;
}

/** Remove um churrasco salvo pelo id. */
export function removerChurrasco(id: string): void {
  persistir(listarChurrascos().filter((c) => c.id !== id));
}
