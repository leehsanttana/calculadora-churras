import { json, erro, handleOptions, uuid } from "../../../_shared/cors";

interface Env {
  DB: D1Database;
}

// POST /api/salas/:code/participantes — entra na sala
export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();

  const sala = await env.DB.prepare(
    "SELECT id, encerrada, expira_em, colaborativa, entrada_json FROM salas WHERE id = ?",
  ).bind(code).first<{
    id: string;
    encerrada: number;
    expira_em: number;
    colaborativa: number;
    entrada_json: string;
  }>();

  if (!sala) return erro("Sala não encontrada", 404);
  if (Date.now() > sala.expira_em) return erro("Sala expirada", 410);
  if (sala.encerrada) return erro("Sala encerrada", 409);
  if (sala.colaborativa !== 1) {
    return erro("Esta lista ainda não foi dividida com a galera", 409);
  }

  // Limite de participantes = nº de contribuintes definido na criação (inclui o
  // anfitrião). Quando lota, novos visitantes só conseguem visualizar.
  let max = Infinity;
  try {
    const c = Number(JSON.parse(sala.entrada_json)?.contribuintes);
    if (Number.isFinite(c) && c > 0) max = Math.floor(c);
  } catch {}
  const contagem = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM participantes WHERE sala_id = ?",
  ).bind(code).first<{ total: number }>();
  if ((contagem?.total ?? 0) >= max) {
    return erro("A lista já atingiu o número de pessoas no rateio", 409);
  }

  let body: { nome?: string };
  try { body = await request.json(); } catch { return erro("Body inválido"); }
  if (!body.nome?.trim()) return erro("Nome é obrigatório");

  const id = uuid();
  await env.DB.prepare(
    "INSERT INTO participantes (id, sala_id, nome, criado_em) VALUES (?, ?, ?, ?)",
  ).bind(id, code, body.nome.trim(), Date.now()).run();

  return json({ id, nome: body.nome.trim() }, 201);
};

export const onRequestOptions: PagesFunction = () => handleOptions();
