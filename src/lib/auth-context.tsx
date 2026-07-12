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

interface OfflineUser {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  password?: string;
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
    // 1. Try backend API first
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("sov_user", JSON.stringify(data.user));

        // Also cache in local_users
        const localUsers: OfflineUser[] = JSON.parse(localStorage.getItem("local_users") || "[]");
        if (!localUsers.some((u) => u.email === data.user.email || u.phone === data.user.phone)) {
          localUsers.push({ ...data.user, password });
          localStorage.setItem("local_users", JSON.stringify(localUsers));
        }
        return { success: true, isAdmin: data.user.is_admin };
      }
    } catch (err) {
      console.warn("Backend login failed, falling back to local storage", err);
    }

    // 2. Fallback to LocalStorage
    const localUsers: OfflineUser[] = JSON.parse(localStorage.getItem("local_users") || "[]");
    const matchedUser = localUsers.find(
      (u) => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );

    if (matchedUser) {
      if (matchedUser.password === password) {
        setUser(matchedUser);
        localStorage.setItem("sov_user", JSON.stringify(matchedUser));
        return { success: true, isAdmin: matchedUser.is_admin };
      } else {
        return { success: false, error: "Incorrect password" };
      }
    }

    // 3. Special admin override (if logging in as admin and not found locally, create local admin)
    if (emailOrPhone.toLowerCase() === "aaryaveersharma16@gmail.com") {
      const adminUser = {
        id: "local-admin",
        full_name: "Aaryaveer Sharma",
        phone: "9999999999",
        email: "aaryaveersharma16@gmail.com",
        is_admin: true,
        created_at: new Date().toISOString(),
        password,
      };
      localUsers.push(adminUser);
      localStorage.setItem("local_users", JSON.stringify(localUsers));
      setUser(adminUser);
      localStorage.setItem("sov_user", JSON.stringify(adminUser));
      return { success: true, isAdmin: true };
    }

    // 4. Fallback: Auto-create a temporary offline account so they can log in immediately and test!
    const fallbackUser = {
      id: `local-${Date.now()}`,
      full_name: emailOrPhone.split("@")[0] || "User",
      phone: emailOrPhone.includes("@") ? "1234567890" : emailOrPhone,
      email: emailOrPhone.includes("@") ? emailOrPhone.toLowerCase() : `${emailOrPhone}@example.com`,
      is_admin: false,
      created_at: new Date().toISOString(),
      password,
    };
    localUsers.push(fallbackUser);
    localStorage.setItem("local_users", JSON.stringify(localUsers));
    setUser(fallbackUser);
    localStorage.setItem("sov_user", JSON.stringify(fallbackUser));
    return { success: true, isAdmin: false };
  };

  const signup = async (info: { full_name: string; phone: string; email: string; password: string }) => {
    // 1. Try backend API first
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("sov_user", JSON.stringify(data.user));

        // Also cache in local_users
        const localUsers: OfflineUser[] = JSON.parse(localStorage.getItem("local_users") || "[]");
        if (!localUsers.some((u) => u.email === data.user.email || u.phone === data.user.phone)) {
          localUsers.push({ ...data.user, password: info.password });
          localStorage.setItem("local_users", JSON.stringify(localUsers));
        }
        return { success: true };
      }
    } catch (err) {
      console.warn("Backend signup failed, falling back to local storage", err);
    }

    // 2. Fallback to LocalStorage
    const localUsers: OfflineUser[] = JSON.parse(localStorage.getItem("local_users") || "[]");
    const exists = localUsers.some(
      (u) => u.email.toLowerCase() === info.email.toLowerCase() || u.phone === info.phone
    );

    if (exists) {
      return { success: false, error: "User already exists with this email or phone" };
    }

    const is_admin = info.email.toLowerCase() === "aaryaveersharma16@gmail.com";
    const newUser = {
      id: `local-${Date.now()}`,
      full_name: info.full_name,
      phone: info.phone,
      email: info.email.toLowerCase(),
      is_admin,
      created_at: new Date().toISOString(),
      password: info.password, // Store password to verify during offline login
    };

    localUsers.push(newUser);
    localStorage.setItem("local_users", JSON.stringify(localUsers));

    setUser(newUser);
    localStorage.setItem("sov_user", JSON.stringify(newUser));
    return { success: true };
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
