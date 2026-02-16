"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, FolderOpen, User } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: Rocket, label: "Launch" },
  { href: "/my-projects", icon: FolderOpen, label: "Projects" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <motion.div
          className="w-8 h-8 border-2 rounded-full"
          style={{ borderColor: "var(--sov-surface-3)", borderTopColor: "var(--sov-accent)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="app-container flex flex-col min-h-dvh">
      <div className="flex-1 pb-20 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 glass"
        style={{
          borderTop: "1px solid var(--sov-border)",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex items-center justify-around px-4 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    style={{
                      color: isActive ? "var(--sov-accent)" : "var(--sov-text-muted)",
                      transition: "color 0.2s",
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--sov-accent)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{
                    color: isActive ? "var(--sov-accent)" : "var(--sov-text-muted)",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
