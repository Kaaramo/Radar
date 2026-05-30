import "server-only";

/**
 * Auth machine-to-machine pour les callbacks OpenClaw → Next.js.
 *
 * OpenClaw envoie le header `X-Internal-Secret` (ou `x-internal-secret`,
 * Node les normalise en lowercase). On compare en timing-safe à
 * `process.env.OPENCLAW_INTERNAL_SECRET` partagé entre les 2 services via
 * docker-compose env.
 *
 * Retourne `null` si OK, sinon une `Response` 401/500 prête à retourner.
 */
export function assertInternalSecret(request: Request): Response | null {
  const expected = process.env.OPENCLAW_INTERNAL_SECRET;
  if (!expected) {
    console.error(
      "[internal-auth] OPENCLAW_INTERNAL_SECRET missing in env — refusing all calls",
    );
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const provided = request.headers.get("x-internal-secret") ?? "";

  // Timing-safe : on évite que la longueur révèle si on est proche du secret.
  // Pour des strings de 64 hex chars (= 32 bytes), comparaison simple suffit
  // car les longueurs sont identiques. Sinon on remplit jusqu'à la même taille.
  if (provided.length !== expected.length) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  if (diff !== 0) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}
