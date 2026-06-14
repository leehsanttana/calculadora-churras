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
      `SELECT c.id, c.participante_id, p.nome AS participante_nome,
              c.item_chave, c.item_nome, c.quantidade, c.unidade
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
