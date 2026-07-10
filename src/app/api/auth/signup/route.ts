import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { full_name, phone, email, password } = await req.json();

    if (!full_name || !phone || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user exists
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .or(`email.eq.${email},phone.eq.${phone}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "User already exists with this email or phone" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Check if this is the admin email
    const is_admin = email.toLowerCase() === "aaryaveersharma16@gmail.com";

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({ full_name, phone, email: email.toLowerCase(), password_hash, is_admin })
      .select("id, full_name, phone, email, is_admin, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
