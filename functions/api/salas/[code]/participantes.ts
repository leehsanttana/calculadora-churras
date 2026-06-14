import { json, erro, handleOptions, uuid } from "../../../_shared/cors";

interface Env {
  DB: D1Database;
}

// POST /api/salas/:code/participantes — entra na sala
export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();

  const sala = await env.DB.prepare(
    "SELECT id, encerrada, expira_em FROM salas WHERE id = ?",
  ).bind(code).first<{ id: string; encerrada: number; expira_em: number }>();

  if (!sala) return erro("Sala não encontrada", 404);
  if (Date.now() > sala.expira_em) return erro("Sala expirada", 410);
  if (sala.encerrada) return erro("Sala encerrada", 409);

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
