import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

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

function createSupabaseClient(): SupabaseClient | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key || !key.startsWith("eyJ")) return null;

  return createClient(url, key);
}

/** Lazy client — avoids Supabase init during static prerender at build time. */
export function getSupabase(): SupabaseClient {
  if (!client) client = createSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase-configuratie ongeldig. In Vercel: NEXT_PUBLIC_SUPABASE_URL = https://<project>.supabase.co en NEXT_PUBLIC_SUPABASE_ANON_KEY = anon public key (begint met eyJ)."
    );
  }
  return client;
}
