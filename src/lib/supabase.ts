import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(url: string): string {
  let cleaned = (url || "").trim();
  if (cleaned && !cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

// Render deployment sets SUPABASE_URL / SUPABASE_ANON_KEY, so check both client/server styles
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseUrl = sanitizeUrl(rawUrl);

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "").trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration is missing or incomplete.", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
