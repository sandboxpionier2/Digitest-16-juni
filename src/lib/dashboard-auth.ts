export const DASHBOARD_AUTH_COOKIE = "dashboard_session";

const SESSION_PAYLOAD = "kampen-dashboard-v1";

function getAuthSecret(): string {
  return (
    process.env.DASHBOARD_AUTH_SECRET ??
    process.env.DASHBOARD_PASSWORD ??
    "Kampen800"
  );
}

export function getDashboardPassword(): string {
  return process.env.DASHBOARD_PASSWORD ?? "Kampen800";
}

async function sign(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  return sign(SESSION_PAYLOAD);
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  return token === expected;
}
