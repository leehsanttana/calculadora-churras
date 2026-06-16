import { json, erro, handleOptions, gerarId, uuid } from "../../_shared/cors";

interface Env {
  DB: D1Database;
}

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

// POST /api/salas — cria uma lista e retorna o código + hostToken.
// Por padrão a lista é PESSOAL (somente leitura para quem abre o link).
// `colaborativa: true` já cria como sala de rateio (editável por participantes).
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: {
    nome?: string;
    entrada?: unknown;
    resultado?: unknown;
    colaborativa?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return erro("Body inválido");
  }

  if (!body.nome || !body.entrada || !body.resultado) {
    return erro("nome, entrada e resultado são obrigatórios");
  }

  const agora = Date.now();
  const hostToken = uuid();
  const colaborativa = body.colaborativa ? 1 : 0;

  // Garante código único com até 5 tentativas
  let code = "";
  for (let i = 0; i < 5; i++) {
    const candidato = gerarId(6);
    const existe = await env.DB.prepare(
      "SELECT id FROM salas WHERE id = ?",
    ).bind(candidato).first();
    if (!existe) { code = candidato; break; }
  }
  if (!code) return erro("Não foi possível gerar código único", 500);

  // Cria sala + participante anfitrião em batch
  const hostId = uuid();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO salas (id, nome, entrada_json, resultado_json, host_token, criada_em, expira_em, colaborativa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      code,
      body.nome,
      JSON.stringify(body.entrada),
      JSON.stringify(body.resultado),
      hostToken,
      agora,
      agora + SETE_DIAS_MS,
      colaborativa,
    ),
    env.DB.prepare(
      "INSERT INTO participantes (id, sala_id, nome, criado_em) VALUES (?, ?, ?, ?)",
    ).bind(hostId, code, body.nome, agora),
  ]);

  return json({ code, hostId, hostToken }, 201);
};

export const onRequestOptions: PagesFunction = () => handleOptions();
