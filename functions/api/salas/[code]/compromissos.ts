import { json, erro, handleOptions, uuid } from "../../../_shared/cors";

interface Env {
  DB: D1Database;
}

interface CompromissoBody {
  participanteId?: string;
  itemChave?: string;
  itemNome?: string;
  quantidade?: number;
  unidade?: string;
}

// PUT /api/salas/:code/compromissos — adiciona ou atualiza compromisso
export const onRequestPut: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();

  const sala = await env.DB.prepare(
    "SELECT id, encerrada, expira_em FROM salas WHERE id = ?",
  ).bind(code).first<{ id: string; encerrada: number; expira_em: number }>();

  if (!sala) return erro("Sala não encontrada", 404);
  if (Date.now() > sala.expira_em) return erro("Sala expirada", 410);
  if (sala.encerrada) return erro("Sala encerrada", 409);

  let body: CompromissoBody;
  try { body = await request.json(); } catch { return erro("Body inválido"); }

  const { participanteId, itemChave, itemNome, quantidade, unidade } = body;
  if (!participanteId || !itemChave || !itemNome || quantidade == null || !unidade) {
    return erro("Campos obrigatórios: participanteId, itemChave, itemNome, quantidade, unidade");
  }
  if (quantidade < 0) return erro("Quantidade não pode ser negativa");

  // Verifica que o participante pertence a esta sala
  const participante = await env.DB.prepare(
    "SELECT id FROM participantes WHERE id = ? AND sala_id = ?",
  ).bind(participanteId, code).first();
  if (!participante) return erro("Participante não encontrado nesta sala", 403);

  if (quantidade === 0) {
    // Remove o compromisso se quantidade = 0
    await env.DB.prepare(
      "DELETE FROM compromissos WHERE sala_id = ? AND participante_id = ? AND item_chave = ?",
    ).bind(code, participanteId, itemChave).run();
    return json({ ok: true, removido: true });
  }

  // Upsert via INSERT OR REPLACE
  await env.DB.prepare(
    `INSERT INTO compromissos (id, sala_id, participante_id, item_chave, item_nome, quantidade, unidade)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(sala_id, participante_id, item_chave)
     DO UPDATE SET quantidade = excluded.quantidade, item_nome = excluded.item_nome`,
  ).bind(uuid(), code, participanteId, itemChave, itemNome, quantidade, unidade).run();

  return json({ ok: true });
};

// DELETE /api/salas/:code/compromissos — anfitrião remove compromisso de outro
export const onRequestDelete: PagesFunction<Env> = async ({ params, env, request }) => {
  const code = (params.code as string).toUpperCase();
  const hostToken = request.headers.get("X-Host-Token");
  if (!hostToken) return erro("Não autorizado", 401);

  const sala = await env.DB.prepare(
    "SELECT id FROM salas WHERE id = ? AND host_token = ?",
  ).bind(code, hostToken).first();
  if (!sala) return erro("Não autorizado", 403);

  let body: { participanteId?: string; itemChave?: string };
  try { body = await request.json(); } catch { return erro("Body inválido"); }
  if (!body.participanteId || !body.itemChave) return erro("participanteId e itemChave são obrigatórios");

  await env.DB.prepare(
    "DELETE FROM compromissos WHERE sala_id = ? AND participante_id = ? AND item_chave = ?",
  ).bind(code, body.participanteId, body.itemChave).run();

  return json({ ok: true });
};

export const onRequestOptions: PagesFunction = () => handleOptions();
