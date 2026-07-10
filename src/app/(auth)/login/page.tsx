"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(emailOrPhone, password);
    setLoading(false);

    if (result.success) {
      if (result.isAdmin) router.replace("/admin");
      else router.replace("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="app-container flex flex-col min-h-dvh px-6 pt-24 pb-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-10 mb-12">
        <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Sovereign<span style={{ color: "var(--sov-accent)" }}>.</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Welcome back
        </h2>
        <p className="text-sm mb-8 text-center" style={{ color: "var(--sov-text-secondary)" }}>
          Sign in to your Sovereign launchpad
        </p>

        <div className="space-y-3">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--sov-text-muted)" }} />
            <input
              type="text"
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl text-base font-medium outline-none transition-all"
              style={{
                background: "var(--sov-surface-2)",
                border: "1px solid var(--sov-border-bright)",
                color: "var(--sov-text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--sov-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--sov-border-bright)")}
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--sov-text-muted)" }} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-xl text-base font-medium outline-none transition-all"
              style={{
                background: "var(--sov-surface-2)",
                border: "1px solid var(--sov-border-bright)",
                color: "var(--sov-text)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--sov-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--sov-border-bright)")}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--sov-text-muted)" }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium mt-3"
            style={{ color: "var(--sov-danger)" }}
          >
            {error}
          </motion.p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 mt-6 transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: "var(--sov-accent)", color: "#000" }}
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              Login
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--sov-text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold" style={{ color: "var(--sov-accent)" }}>
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
