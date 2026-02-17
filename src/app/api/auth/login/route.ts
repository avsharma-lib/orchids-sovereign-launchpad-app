import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { emailOrPhone, password } = await req.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Special admin check
    if (emailOrPhone.toLowerCase() === "aaryaveersharma16@gmail.com" && password === "legend80") {
      const { data: adminUser } = await supabaseAdmin
        .from("users")
        .select("id, full_name, phone, email, is_admin, created_at")
        .eq("email", "aaryaveersharma16@gmail.com")
        .single();

      if (adminUser) {
        return NextResponse.json({ user: { ...adminUser, is_admin: true } });
      }
      // Create admin if not exists
      const password_hash = await bcrypt.hash("legend80", 10);
      const { data: newAdmin, error } = await supabaseAdmin
        .from("users")
        .insert({
          full_name: "Admin",
          phone: "0000000000",
          email: "aaryaveersharma16@gmail.com",
          password_hash,
          is_admin: true,
        })
        .select("id, full_name, phone, email, is_admin, created_at")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ user: newAdmin });
    }

    // Normal login — find by email or phone
    const isEmail = emailOrPhone.includes("@");
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq(isEmail ? "email" : "phone", isEmail ? emailOrPhone.toLowerCase() : emailOrPhone)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
