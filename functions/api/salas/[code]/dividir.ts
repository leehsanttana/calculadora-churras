import { json, erro, handleOptions } from "../../../_shared/cors";

interface Env {
  DB: D1Database;
}

// POST /api/salas/:code/dividir — anfitrião transforma a lista pessoal em
// sala de rateio colaborativa. A partir daí qualquer pessoa com o link pode
// entrar e assumir itens.
export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();
  const hostToken = request.headers.get("X-Host-Token");
  if (!hostToken) return erro("Não autorizado", 401);

  const sala = await env.DB.prepare(
    "SELECT id, encerrada FROM salas WHERE id = ? AND host_token = ?",
  ).bind(code, hostToken).first<{ id: string; encerrada: number }>();
  if (!sala) return erro("Não autorizado ou sala não encontrada", 403);
  if (sala.encerrada) return erro("Sala encerrada", 409);

  await env.DB.prepare(
    "UPDATE salas SET colaborativa = 1 WHERE id = ?",
  ).bind(code).run();

  return json({ ok: true });
};

export const onRequestOptions: PagesFunction = () => handleOptions();
