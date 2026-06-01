import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.endsWith(".supabase.co")) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

/** Server-only Supabase client (service role). Used for dashboard admin actions. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey?.startsWith("eyJ")) return null;

  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
