"use client";

import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Rocket, Globe, Layers, Zap, ArrowRight, Sparkles,
  Code2, Smartphone, BarChart3, ShoppingCart, Palette,
  Shield, Workflow, PenTool
} from "lucide-react";

const services = [
  { icon: Globe, label: "Business Sites", color: "#BFFF00" },
  { icon: Rocket, label: "Landing Pages", color: "#00E676" },
  { icon: ShoppingCart, label: "E-commerce", color: "#FFB300" },
  { icon: Code2, label: "Web Apps", color: "#7C4DFF" },
  { icon: Smartphone, label: "Mobile PWA", color: "#FF4081" },
  { icon: BarChart3, label: "Dashboards", color: "#00B0FF" },
  { icon: Palette, label: "Portfolio", color: "#FF6E40" },
  { icon: Shield, label: "SaaS", color: "#69F0AE" },
  { icon: Workflow, label: "Automation", color: "#FFAB40" },
  { icon: PenTool, label: "CMS Sites", color: "#E040FB" },
  { icon: Layers, label: "Custom Apps", color: "#40C4FF" },
  { icon: Zap, label: "API Integration", color: "#EEFF41" },
];

const processSteps = [
  { num: "01", title: "Discovery", desc: "We learn your business, goals, and vision" },
  { num: "02", title: "Strategy", desc: "Architecture, tech stack, and growth plan" },
  { num: "03", title: "Design & Build", desc: "Pixel-perfect development with real engineering" },
  { num: "04", title: "Launch & Grow", desc: "Deploy, optimize, and scale your presence" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Welcome back
          </p>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {user?.full_name?.split(" ")[0] || "there"}
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--sov-accent)", color: "#000" }}
        >
          {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
        </div>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
        style={{
          background: "linear-gradient(135deg, var(--sov-surface) 0%, var(--sov-surface-2) 100%)",
          border: "1px solid var(--sov-border-bright)",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, var(--sov-accent-dim), transparent)" }}
        />

        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mb-4"
            style={{
              background: "var(--sov-accent-dim)",
              color: "var(--sov-accent)",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <Sparkles size={10} />
            Premium Web Agency
          </div>

          <h2 className="text-lg font-bold mb-1.5 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            We build websites{" "}
            <span className="italic" style={{ color: "var(--sov-accent)" }}>
              that convert
            </span>
          </h2>
          <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--sov-text-secondary)" }}>
            Launch your business online in 72 hours. Performance-driven, custom engineered.
          </p>

          <Link
            href="/new-project"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
            style={{ background: "var(--sov-accent)", color: "#000" }}
          >
            <Rocket size={16} />
            Start Your Project
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="mb-8">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Our Services
          </h3>
          <span className="text-[10px] font-medium" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
            {services.length} types
          </span>
        </motion.div>

        <div className="grid grid-cols-3 gap-2.5">
          {services.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-[0.96]"
              style={{
                background: "var(--sov-surface)",
                border: "1px solid var(--sov-border)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}15` }}
              >
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: "var(--sov-text-secondary)" }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How We Work */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="mb-8">
        <motion.h3 variants={fadeUp} className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          How We Work
        </motion.h3>

        <div className="space-y-3">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{
                background: "var(--sov-surface)",
                border: "1px solid var(--sov-border)",
              }}
            >
              <span
                className="text-lg font-black shrink-0"
                style={{ fontFamily: "var(--font-display)", color: "var(--sov-accent)", opacity: 0.6 }}
              >
                {step.num}
              </span>
              <div>
                <h4 className="text-sm font-bold mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  {step.title}
                </h4>
                <p className="text-xs" style={{ color: "var(--sov-text-secondary)" }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Positioning Statements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-2 mb-6"
      >
        {[
          "Custom engineered, not template based",
          "Built for conversion and growth",
          "Performance-driven websites",
        ].map((text) => (
          <div
            key={text}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "var(--sov-surface)" }}
          >
            <Zap size={12} style={{ color: "var(--sov-accent)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--sov-text-secondary)" }}>
              {text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
