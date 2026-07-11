import { createClient, SupabaseClient } from "@supabase/supabase-js";

function sanitizeUrl(url: string): string {
  let cleaned = (url || "").trim();
  if (cleaned && !cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseUrl = sanitizeUrl(rawUrl);

    const supabaseAnonKey = (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      ""
    ).trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase configuration is missing or incomplete at runtime initialization.", {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey,
      });
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Export a Proxy that forwards all property accesses and function calls to the lazily initialized client.
// This prevents Next.js from caching empty/invalid build-time environment variables.
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
