"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Clock, CheckCircle2, Loader2, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  business_name: string;
  website_types: string[];
  status: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  estimated_delivery: string;
  created_at: string;
  project_files: { id: string; file_name: string; file_url: string }[];
}

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  Pending: { color: "#FFB300", icon: Clock },
  "In Progress": { color: "#00B0FF", icon: Loader2 },
  Completed: { color: "#00E676", icon: CheckCircle2 },
};

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/projects?user_id=${user.id}`)
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>My Projects</h1>
        <p className="text-xs mt-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
          {projects.length} project{projects.length !== 1 ? "s" : ""} submitted
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div className="w-6 h-6 border-2 rounded-full" style={{ borderColor: "var(--sov-surface-3)", borderTopColor: "var(--sov-accent)" }}
            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        </div>
      ) : projects.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--sov-surface-2)" }}>
            <FolderOpen size={28} style={{ color: "var(--sov-text-muted)" }} />
          </div>
          <p className="text-sm font-semibold mb-1">No projects yet</p>
          <p className="text-xs mb-6" style={{ color: "var(--sov-text-muted)" }}>Start your first project to see it here</p>
          <Link href="/new-project" className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
            style={{ background: "var(--sov-accent)", color: "#000" }}>
            Start a Project
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => {
            const sc = statusConfig[p.status] || statusConfig.Pending;
            const StatusIcon = sc.icon;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4"
                style={{ background: "var(--sov-surface)", border: "1px solid var(--sov-border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {p.business_name || "Untitled Project"}
                    </h3>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: `${sc.color}15` }}>
                    <StatusIcon size={12} style={{ color: sc.color }} />
                    <span className="text-[10px] font-bold" style={{ color: sc.color }}>{p.status}</span>
                  </div>
                </div>

                {p.website_types?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.website_types.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[9px] font-semibold"
                        style={{ background: "var(--sov-surface-2)", color: "var(--sov-text-secondary)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "var(--sov-accent)" }}>
                    ₹{p.estimated_cost_min?.toLocaleString()} — ₹{p.estimated_cost_max?.toLocaleString()}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--sov-text-muted)" }}>{p.estimated_delivery}</span>
                </div>

                {p.project_files?.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--sov-border)" }}>
                    <p className="text-[9px] font-bold mb-1.5" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                      Files
                    </p>
                    <div className="space-y-1">
                      {p.project_files.map((f) => (
                        <a key={f.id} href={f.file_url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--sov-text-secondary)" }}>
                          <FileText size={10} /> {f.file_name} <ExternalLink size={8} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
