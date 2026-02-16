import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, full_name, phone, email, is_admin, created_at")
    .order("created_at", { ascending: false });

  const { data: projects } = await supabaseAdmin
    .from("projects")
    .select("*, project_files(*), users(full_name, email, phone)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ users: users || [], projects: projects || [] });
}

export async function PATCH(req: NextRequest) {
  const { project_id, status, lead_status, payment_status } = await req.json();
  
  const updates: Record<string, string> = {};
  if (status) updates.status = status;
  if (lead_status) updates.lead_status = lead_status;
  if (payment_status) updates.payment_status = payment_status;

  const { error } = await supabaseAdmin
    .from("projects")
    .update(updates)
    .eq("id", project_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
