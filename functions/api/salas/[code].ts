import { json, erro, handleOptions } from "../../_shared/cors";

interface Env {
  DB: D1Database;
}

interface SalaRow {
  id: string;
  nome: string;
  resultado_json: string;
  encerrada: number;
  expira_em: number;
}

// GET /api/salas/:code — retorna estado completo da sala (polling)
export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const code = (params.code as string).toUpperCase();

  const sala = await env.DB.prepare(
    "SELECT id, nome, resultado_json, encerrada, expira_em FROM salas WHERE id = ?",
  ).bind(code).first<SalaRow>();

  if (!sala) return erro("Sala não encontrada", 404);
  if (Date.now() > sala.expira_em) return erro("Sala expirada", 410);

  const [{ results: participantes }, { results: compromissos }] = await env.DB.batch([
    env.DB.prepare(
      "SELECT id, nome FROM participantes WHERE sala_id = ? ORDER BY criado_em",
    ).bind(code),
    env.DB.prepare(
      `SELECT c.id, c.participante_id AS participanteId, p.nome AS participanteNome,
              c.item_chave AS itemChave, c.item_nome AS itemNome, c.quantidade, c.unidade
       FROM compromissos c
       JOIN participantes p ON p.id = c.participante_id
       WHERE c.sala_id = ?`,
    ).bind(code),
  ]);

  return json({
    code: sala.id,
    nome: sala.nome,
    encerrada: sala.encerrada === 1,
    resultado: JSON.parse(sala.resultado_json),
    participantes,
    compromissos,
  });
};

// PUT /api/salas/:code — anfitrião edita a lista (entrada/resultado/nome).
// Os compromissos já marcados são mantidos; itens removidos simplesmente
// deixam de aparecer (ficam órfãos e são ignorados pela UI).
export const onRequestPut: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();
  const hostToken = request.headers.get("X-Host-Token");
  if (!hostToken) return erro("Não autorizado", 401);

  const sala = await env.DB.prepare(
    "SELECT id, encerrada FROM salas WHERE id = ? AND host_token = ?",
  ).bind(code, hostToken).first<{ id: string; encerrada: number }>();
  if (!sala) return erro("Não autorizado ou sala não encontrada", 403);
  if (sala.encerrada) return erro("Sala encerrada", 409);

  let body: { nome?: string; entrada?: unknown; resultado?: unknown };
  try { body = await request.json(); } catch { return erro("Body inválido"); }
  if (!body.entrada || !body.resultado) {
    return erro("entrada e resultado são obrigatórios");
  }

  await env.DB.prepare(
    `UPDATE salas
     SET nome = COALESCE(?, nome), entrada_json = ?, resultado_json = ?
     WHERE id = ?`,
  ).bind(
    body.nome ?? null,
    JSON.stringify(body.entrada),
    JSON.stringify(body.resultado),
    code,
  ).run();

  return json({ ok: true });
};

// DELETE /api/salas/:code — anfitrião encerra a sala
export const onRequestDelete: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();
  const hostToken = request.headers.get("X-Host-Token");
  if (!hostToken) return erro("Não autorizado", 401);

  const sala = await env.DB.prepare(
    "SELECT id FROM salas WHERE id = ? AND host_token = ?",
  ).bind(code, hostToken).first();
  if (!sala) return erro("Não autorizado ou sala não encontrada", 403);

  await env.DB.prepare("UPDATE salas SET encerrada = 1 WHERE id = ?").bind(code).run();
  return json({ ok: true });
};

export const onRequestOptions: PagesFunction = () => handleOptions();
