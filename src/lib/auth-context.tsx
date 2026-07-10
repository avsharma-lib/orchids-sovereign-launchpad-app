"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";

interface User {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signup: (data: { full_name: string; phone: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sov_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        let errMsg = data.error || "Login failed";
        if (errMsg.toLowerCase().includes("fetch failed")) {
          errMsg = "Unable to connect to the database (fetch failed). Please make sure you have set SUPABASE_URL and SUPABASE_ANON_KEY correctly in your Render dashboard environment variables, and that they do not contain trailing spaces or incorrect prefixes.";
        } else {
          errMsg = `Database/Login Error: ${errMsg}`;
        }
        return { success: false, error: errMsg };
      }
      setUser(data.user);
      localStorage.setItem("sov_user", JSON.stringify(data.user));
      return { success: true, isAdmin: data.user.is_admin };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const signup = async (info: { full_name: string; phone: string; email: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (!res.ok) {
        let errMsg = data.error || "Signup failed";
        if (errMsg.toLowerCase().includes("fetch failed")) {
          errMsg = "Unable to connect to the database (fetch failed). Please make sure you have set SUPABASE_URL and SUPABASE_ANON_KEY correctly in your Render dashboard environment variables, and that they do not contain trailing spaces or incorrect prefixes.";
        } else {
          errMsg = `Database/Signup Error: ${errMsg}`;
        }
        return { success: false, error: errMsg };
      }
      setUser(data.user);
      localStorage.setItem("sov_user", JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sov_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
