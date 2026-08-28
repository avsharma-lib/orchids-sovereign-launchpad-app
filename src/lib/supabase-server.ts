import { createClient, SupabaseClient } from "@supabase/supabase-js";

function sanitizeValue(val: string): string {
  let cleaned = (val || "").trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

function sanitizeUrl(url: string): string {
  let cleaned = sanitizeValue(url);
  if (cleaned && !cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseUrl = sanitizeUrl(rawUrl);

    // Fallback to anon key if service role key is not configured/set (e.g. Render deployments)
    const serviceRoleKey = sanitizeValue(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      ""
    );

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("Supabase admin configuration is missing or incomplete at runtime initialization.", {
        url: !!supabaseUrl,
        key: !!serviceRoleKey,
      });
    }

    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  }
  return _supabaseAdmin;
}

// Export a Proxy that forwards all property accesses and function calls to the lazily initialized client.
// This prevents Next.js from caching empty/invalid build-time environment variables.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
