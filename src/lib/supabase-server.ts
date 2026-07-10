import { createClient } from "@supabase/supabase-js";

// Render deployment sets SUPABASE_URL / SUPABASE_ANON_KEY, so check both client/server styles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

// Fallback to anon key if service role key is not configured/set (e.g. Render deployments)
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn("Supabase admin configuration is missing or incomplete.", {
    url: !!supabaseUrl,
    key: !!serviceRoleKey,
  });
}

export const supabaseAdmin = createClient(supabaseUrl || "", serviceRoleKey || "");
