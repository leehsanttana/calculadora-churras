export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export function erro(mensagem: string, status = 400): Response {
  return json({ erro: mensagem }, status);
}

export function handleOptions(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function gerarId(tamanho = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  const arr = new Uint8Array(tamanho);
  crypto.getRandomValues(arr);
  for (const byte of arr) id += chars[byte % chars.length];
  return id;
}

export function uuid(): string {
  return crypto.randomUUID();
}
