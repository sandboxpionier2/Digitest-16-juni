import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function normalizeSupabaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  try {
    return createClient(normalizeSupabaseUrl(url), key);
  } catch {
    return null;
  }
}

/** Lazy client — avoids Supabase init during static prerender at build time. */
export function getSupabase(): SupabaseClient {
  if (!client) client = createSupabaseClient();
  if (!client) {
    throw new Error(
      "Supabase is niet geconfigureerd. Zet geldige NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel."
    );
  }
  return client;
}
