import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("project_id") as string;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("project-files")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabaseAdmin.storage
      .from("project-files")
      .getPublicUrl(fileName);

    if (projectId) {
      await supabaseAdmin.from("project_files").insert({
        project_id: projectId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
      });
    }

    return NextResponse.json({ url: urlData.publicUrl, name: file.name });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
