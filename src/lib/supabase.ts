import { createClient } from "@supabase/supabase-js";

// Render deployment sets SUPABASE_URL / SUPABASE_ANON_KEY, so check both client/server styles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration is missing or incomplete.", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  });
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
