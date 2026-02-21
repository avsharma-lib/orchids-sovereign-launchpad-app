import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id, business_name, industry, website_types, features,
      description, competitor_urls, deadline_urgency,
      estimated_cost_min, estimated_cost_max, estimated_delivery,
      contact_name, contact_phone, contact_email, contact_whatsapp,
      uploaded_files,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        user_id, business_name, industry, website_types, features,
        description, competitor_urls, deadline_urgency,
        estimated_cost_min, estimated_cost_max, estimated_delivery,
        contact_name, contact_phone, contact_email, contact_whatsapp,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (uploaded_files && uploaded_files.length > 0) {
      const fileRecords = uploaded_files.map((file: { name: string; url: string }) => ({
        project_id: data.id,
        file_name: file.name,
        file_url: file.url,
      }));

      await supabaseAdmin.from("project_files").insert(fileRecords);
    }

    return NextResponse.json({ project: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*, project_files(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}
