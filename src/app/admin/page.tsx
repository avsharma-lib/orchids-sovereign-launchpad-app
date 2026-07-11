"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, FolderOpen, ArrowLeft, ChevronDown, ChevronUp,
  Mail, Phone, Calendar, Globe, FileText, ExternalLink, LogOut
} from "lucide-react";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

interface AdminProject {
  id: string;
  business_name: string;
  industry: string;
  website_types: string[];
  features: string[];
  description: string;
  competitor_urls: string;
  deadline_urgency: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  estimated_delivery: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  status: string;
  lead_status: string;
  payment_status: string;
  created_at: string;
  users: { full_name: string; email: string; phone: string } | null;
  project_files: { id: string; file_name: string; file_url: string }[];
}

const statusOptions = ["Pending", "In Progress", "Completed"];
const leadOptions = ["New", "Contacted", "Qualified", "Closed"];
const payOptions = ["Unpaid", "Partial", "Paid"];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"projects" | "users">("projects");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.is_admin) {
      router.replace("/dashboard");
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin");
    const data = await res.json();
    setUsers(data.users || []);
    setProjects(data.projects || []);
    setLoading(false);
  };

  const updateProject = async (projectId: string, field: string, value: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, [field]: value }),
    });
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, [field]: value } : p))
    );
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user?.is_admin) return null;

  const statusColors: Record<string, string> = {
    Pending: "#FFB300", "In Progress": "#00B0FF", Completed: "#00E676",
    New: "#7C4DFF", Contacted: "#FFB300", Qualified: "#00E676", Closed: "#FF4444",
    Unpaid: "#FF4444", Partial: "#FFB300", Paid: "#00E676",
  };

  return (
    <div className="app-container min-h-dvh px-5 pt-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--sov-accent-dim)" }}>
            <Shield size={18} style={{ color: "var(--sov-accent)" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Admin Panel</h1>
            <p className="text-[10px]" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
              {projects.length} projects · {users.length} users
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,68,68,0.1)" }}>
          <LogOut size={16} style={{ color: "var(--sov-danger)" }} />
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "projects" as const, label: "Projects", icon: FolderOpen, count: projects.length },
          { key: "users" as const, label: "Users", icon: Users, count: users.length },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all"
            style={{
              background: tab === t.key ? "var(--sov-accent-dim)" : "var(--sov-surface)",
              border: `1px solid ${tab === t.key ? "var(--sov-accent)" : "var(--sov-border)"}`,
              color: tab === t.key ? "var(--sov-accent)" : "var(--sov-text-secondary)",
            }}>
            <t.icon size={14} />
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div className="w-6 h-6 border-2 rounded-full"
            style={{ borderColor: "var(--sov-surface-3)", borderTopColor: "var(--sov-accent)" }}
            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        </div>
      ) : tab === "projects" ? (
        <div className="space-y-3">
          {projects.map((p) => (
            <motion.div key={p.id} layout className="rounded-xl overflow-hidden"
              style={{ background: "var(--sov-surface)", border: "1px solid var(--sov-border)" }}>
              <button onClick={() => setExpandedProject(expandedProject === p.id ? null : p.id)}
                className="w-full p-4 text-left">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {p.business_name || "Untitled"}
                    </h3>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
                      {p.users?.full_name || p.contact_name} · {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `${statusColors[p.lead_status] || "#888"}20`, color: statusColors[p.lead_status] || "#888" }}>
                      {p.lead_status}
                    </span>
                    {expandedProject === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>
              </button>

              {expandedProject === p.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-4 space-y-4">
                  <div className="h-px" style={{ background: "var(--sov-border)" }} />

                  {/* Status controls */}
                  <div className="grid grid-cols-3 gap-2">
                    <StatusSelect label="Status" value={p.status} options={statusOptions} colors={statusColors}
                      onChange={(v) => updateProject(p.id, "status", v)} />
                    <StatusSelect label="Lead" value={p.lead_status} options={leadOptions} colors={statusColors}
                      onChange={(v) => updateProject(p.id, "lead_status", v)} />
                    <StatusSelect label="Payment" value={p.payment_status} options={payOptions} colors={statusColors}
                      onChange={(v) => updateProject(p.id, "payment_status", v)} />
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <InfoRow icon={<Globe size={12} />} label="Industry" value={p.industry} />
                    <InfoRow icon={<Mail size={12} />} label="Email" value={p.contact_email} />
                    <InfoRow icon={<Phone size={12} />} label="Phone" value={p.contact_phone} />
                    {p.contact_whatsapp && <InfoRow icon={<Phone size={12} />} label="WhatsApp" value={p.contact_whatsapp} />}
                    <InfoRow icon={<Calendar size={12} />} label="Deadline" value={p.deadline_urgency} />
                    <InfoRow icon={<FileText size={12} />} label="Estimate" value={`₹${p.estimated_cost_min?.toLocaleString()} — ₹${p.estimated_cost_max?.toLocaleString()}`} />
                  </div>

                  {p.website_types?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Types</p>
                      <div className="flex flex-wrap gap-1">
                        {p.website_types.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded text-[9px] font-semibold" style={{ background: "var(--sov-surface-2)", color: "var(--sov-text-secondary)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.features?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Features</p>
                      <div className="flex flex-wrap gap-1">
                        {p.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 rounded text-[9px] font-semibold" style={{ background: "var(--sov-accent-dim)", color: "var(--sov-accent)" }}>{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.description && (
                    <div>
                      <p className="text-[9px] font-bold mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Description</p>
                      <p className="text-xs" style={{ color: "var(--sov-text-secondary)" }}>{p.description}</p>
                    </div>
                  )}

                  {p.project_files?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold mb-1.5" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Reference Website Image</p>
                      <div className="space-y-3">
                        {p.project_files.map((f) => {
                          const isRefImage = f.file_name === "Reference Image URL";
                          if (isRefImage) {
                            return (
                              <div key={f.id} className="space-y-1.5">
                                <div className="relative overflow-hidden rounded-lg border border-border bg-black/40 max-w-sm">
                                  <img
                                    src={f.file_url}
                                    alt="Reference Website Preview"
                                    className="w-full h-auto max-h-56 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <a href={f.file_url} target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[10px] font-medium transition-colors hover:underline" style={{ color: "var(--sov-accent)" }}>
                                  <FileText size={10} /> Open Reference Website URL <ExternalLink size={8} />
                                </a>
                                <div className="text-[10px] break-all select-all font-mono p-2 rounded bg-black/30 text-white/80 border border-white/5 max-w-sm mt-1">
                                  {f.file_url}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={f.id} className="space-y-1">
                              <a href={f.file_url} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 text-[10px] font-medium transition-colors hover:underline" style={{ color: "var(--sov-accent)" }}>
                                <FileText size={10} /> {f.file_name} <ExternalLink size={8} />
                              </a>
                              <div className="text-[10px] break-all select-all font-mono p-2 rounded bg-black/30 text-white/80 border border-white/5 max-w-sm">
                                {f.file_url}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
          {projects.length === 0 && (
            <p className="text-center py-10 text-sm" style={{ color: "var(--sov-text-muted)" }}>No projects yet</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => (
            <motion.div key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "var(--sov-surface)", border: "1px solid var(--sov-border)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: u.is_admin ? "var(--sov-accent)" : "var(--sov-surface-2)", color: u.is_admin ? "#000" : "var(--sov-text-secondary)" }}>
                {u.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{u.full_name}</p>
                <p className="text-[10px] truncate" style={{ color: "var(--sov-text-muted)" }}>{u.email}</p>
                <p className="text-[10px]" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>{u.phone}</p>
              </div>
              <span className="text-[9px] font-medium" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
                {new Date(u.created_at).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusSelect({ label, value, options, colors, onChange }: {
  label: string; value: string; options: string[]; colors: Record<string, string>; onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[8px] font-bold mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-2 rounded-lg text-[10px] font-bold outline-none appearance-none"
        style={{ background: `${colors[value] || "#888"}15`, border: `1px solid ${colors[value] || "#888"}40`, color: colors[value] || "#888" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "var(--sov-text-muted)" }}>{icon}</span>
      <span className="text-[10px] font-medium" style={{ color: "var(--sov-text-muted)" }}>{label}:</span>
      <span className="text-[10px] font-semibold">{value}</span>
    </div>
  );
}
