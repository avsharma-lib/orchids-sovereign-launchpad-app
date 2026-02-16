"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, LogOut, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) return null;

  const infoItems = [
    { icon: User, label: "Full Name", value: user.full_name },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Phone", value: user.phone },
    { icon: Calendar, label: "Member Since", value: new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  ];

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Profile</h1>
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-3"
          style={{ background: "linear-gradient(135deg, var(--sov-accent), #8BC34A)", color: "#000" }}>
          {user.full_name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{user.full_name}</h2>
        <p className="text-xs" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
          {user.email}
        </p>
        {user.is_admin && (
          <div className="flex items-center gap-1 mt-2 px-3 py-1 rounded-full"
            style={{ background: "var(--sov-accent-dim)", color: "var(--sov-accent)" }}>
            <Shield size={12} />
            <span className="text-[10px] font-bold">ADMIN</span>
          </div>
        )}
      </motion.div>

      {/* Info cards */}
      <div className="space-y-2 mb-8">
        {infoItems.map((item, i) => (
          <motion.div key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: "var(--sov-surface)", border: "1px solid var(--sov-border)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--sov-surface-2)" }}>
              <item.icon size={16} style={{ color: "var(--sov-text-muted)" }} />
            </div>
            <div>
              <p className="text-[10px] font-medium" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {item.label}
              </p>
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleLogout}
        className="w-full h-13 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        style={{
          height: "52px",
          background: "var(--sov-accent)",
          color: "#000",
        }}
      >
        <LogOut size={16} />
        Logout
      </motion.button>
    </div>
  );
}
