import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "change-this-immediately";

// Simple signed cookie session: base64url(email) + HMAC-SHA256 signature
export function createSession(email: string): string {
  const body = Buffer.from(email).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(email).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const email = Buffer.from(body, "base64url").toString();
  if (email !== (process.env.ADMIN_EMAIL || "").toLowerCase()) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(email).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
