"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Building2, FileText,
  DollarSign, Phone, Briefcase, Calendar,
  MessageSquare, Globe, Rocket
} from "lucide-react";

const websiteTypes = [
  "Business Website", "Landing Page", "E-commerce Store", "Web Application",
  "Custom Dashboard", "SaaS Platform", "Portfolio", "Personal Brand",
  "Mobile PWA", "CMS Website", "Booking System", "API Integration",
];

const featureOptions = [
  "Booking System", "Payment Integration", "Admin Dashboard",
  "Mobile App", "Custom Feature", "SEO Optimization",
  "Analytics", "Email Automation", "Chat/Messaging",
];

const industries = [
  "Technology", "Healthcare", "E-commerce", "Education", "Finance",
  "Real Estate", "Food & Beverage", "Fitness", "Travel", "Consulting",
  "Legal", "Entertainment", "Non-profit", "Other",
];

const deadlineOptions = [
  { label: "Urgent (1-2 weeks)", value: "urgent" },
  { label: "Normal (3-4 weeks)", value: "normal" },
  { label: "Relaxed (1-2 months)", value: "relaxed" },
  { label: "Flexible", value: "flexible" },
];

function calcEstimate(types: string[], features: string[]) {
  let base = 15000;
  const typeMulti: Record<string, number> = {
    "E-commerce Store": 25000, "Web Application": 30000, "SaaS Platform": 40000,
    "Custom Dashboard": 20000, "Mobile PWA": 15000, "Booking System": 12000,
    "API Integration": 10000,
  };
  types.forEach((t) => { base += typeMulti[t] || 5000; });

  const featureCost: Record<string, number> = {
    "Booking System": 8000, "Payment Integration": 6000, "Admin Dashboard": 10000,
    "Mobile App": 15000, "Custom Feature": 12000, "SEO Optimization": 3000,
    "Analytics": 4000, "Email Automation": 5000, "Chat/Messaging": 7000,
  };
  features.forEach((f) => { base += featureCost[f] || 3000; });

  const min = base;
  const max = Math.round(base * 1.4);
  const weeks = Math.max(2, Math.round(base / 15000));
  return { min, max, weeks };
}

const stepLabels = ["Business", "Details", "Estimate", "Contact"];

export default function NewProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Step 2
  const [description, setDescription] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [deadline, setDeadline] = useState("normal");
  const [refImageUrl, setRefImageUrl] = useState("");

  // Step 4
  const [contactName, setContactName] = useState(user?.full_name || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactWhatsapp, setContactWhatsapp] = useState("");

  const estimate = calcEstimate(selectedTypes, selectedFeatures);

  const toggleItem = (arr: string[], item: string, setter: (a: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const handleSubmit = async () => {
    if (!contactName || !contactPhone || !contactEmail) return;
    setLoading(true);

    const projectData = {
      id: `local-${Date.now()}`,
      user_id: user?.id,
      business_name: businessName,
      industry,
      website_types: selectedTypes,
      features: selectedFeatures,
      description,
      competitor_urls: competitorUrls,
      deadline_urgency: deadline,
      estimated_cost_min: estimate.min,
      estimated_cost_max: estimate.max,
      estimated_delivery: `${estimate.weeks} weeks`,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      contact_whatsapp: contactWhatsapp,
      ref_image_url: refImageUrl,
      status: "Pending",
      lead_status: "New",
      payment_status: "Unpaid",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          business_name: businessName,
          industry,
          website_types: selectedTypes,
          features: selectedFeatures,
          description,
          competitor_urls: competitorUrls,
          deadline_urgency: deadline,
          estimated_cost_min: estimate.min,
          estimated_cost_max: estimate.max,
          estimated_delivery: `${estimate.weeks} weeks`,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          contact_whatsapp: contactWhatsapp,
          ref_image_url: refImageUrl,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend project submission failed, falling back to local storage", err);
    }

    // LocalStorage Fallback
    const localProjects = JSON.parse(localStorage.getItem("local_projects") || "[]");
    localProjects.push(projectData);
    localStorage.setItem("local_projects", JSON.stringify(localProjects));

    setSubmitted(true);
    setLoading(false);
  };

  const slideVariants = {
    enter: { x: 60, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -60, opacity: 0 },
  };

  if (submitted) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(0,230,118,0.12)", border: "2px solid rgba(0,230,118,0.3)" }}
        >
          <CheckCircle2 size={40} style={{ color: "var(--sov-success)" }} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Project Submitted!
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-sm mb-8" style={{ color: "var(--sov-text-secondary)" }}>
          We&apos;ll review your project and get back to you within 24 hours.
        </motion.p>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={() => router.push("/my-projects")}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
          style={{ background: "var(--sov-accent)", color: "#000" }}>
          View My Projects
        </motion.button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 0 ? setStep(step - 1) : router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-[0.9]"
          style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border)" }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Start Your Project</h1>
          <p className="text-[10px] font-medium" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Step {step + 1} of {stepLabels.length}
          </p>
        </div>
      </motion.div>

      {/* Mini stepper */}
      <div className="flex gap-1.5 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--sov-surface-3)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--sov-accent)" }}
                initial={{ width: "0%" }}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-[9px] font-medium mt-1 block" style={{ color: i <= step ? "var(--sov-accent)" : "var(--sov-text-muted)", fontFamily: "var(--font-mono)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <SectionTitle icon={<Building2 size={16} />} title="Business Info" />

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>Business Name</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business name"
              className="w-full h-12 px-4 rounded-xl text-sm font-medium outline-none mb-4"
              style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border-bright)", color: "var(--sov-text)" }} />

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>Industry</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-12 px-4 rounded-xl text-sm font-medium outline-none mb-5 appearance-none"
              style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border-bright)", color: "var(--sov-text)" }}>
              <option value="">Select industry</option>
              {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>Website Type Needed</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {websiteTypes.map((t) => (
                <button key={t} onClick={() => toggleItem(selectedTypes, t, setSelectedTypes)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-[0.96]"
                  style={{
                    background: selectedTypes.includes(t) ? "var(--sov-accent-dim)" : "var(--sov-surface-2)",
                    border: `1px solid ${selectedTypes.includes(t) ? "var(--sov-accent)" : "var(--sov-border)"}`,
                    color: selectedTypes.includes(t) ? "var(--sov-accent)" : "var(--sov-text-secondary)",
                  }}>
                  {t}
                </button>
              ))}
            </div>

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>Features Needed</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {featureOptions.map((f) => (
                <button key={f} onClick={() => toggleItem(selectedFeatures, f, setSelectedFeatures)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-[0.96]"
                  style={{
                    background: selectedFeatures.includes(f) ? "var(--sov-accent-dim)" : "var(--sov-surface-2)",
                    border: `1px solid ${selectedFeatures.includes(f) ? "var(--sov-accent)" : "var(--sov-border)"}`,
                    color: selectedFeatures.includes(f) ? "var(--sov-accent)" : "var(--sov-text-secondary)",
                  }}>
                  {f}
                </button>
              ))}
            </div>

            <NextButton onClick={() => setStep(1)} />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <SectionTitle icon={<FileText size={16} />} title="Project Details" />

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>
              Image URL of Reference Website
            </label>
            <input
              type="url"
              placeholder="e.g. https://example.com/image.png"
              value={refImageUrl}
              onChange={(e) => setRefImageUrl(e.target.value)}
              className="w-full h-12 px-4 rounded-xl text-sm font-medium outline-none mb-4 transition-all"
              style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border-bright)", color: "var(--sov-text)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--sov-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--sov-border-bright)")}
            />

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>
              Describe What You Want
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your ideal website, features, style..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none mb-4 resize-none"
              style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border-bright)", color: "var(--sov-text)" }} />

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>
              Competitor / Example Sites
            </label>
            <input value={competitorUrls} onChange={(e) => setCompetitorUrls(e.target.value)}
              placeholder="e.g. stripe.com, notion.so"
              className="w-full h-12 px-4 rounded-xl text-sm font-medium outline-none mb-4"
              style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border-bright)", color: "var(--sov-text)" }} />

            <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--sov-text-secondary)" }}>
              Deadline Urgency
            </label>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {deadlineOptions.map((d) => (
                <button key={d.value} onClick={() => setDeadline(d.value)}
                  className="px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all active:scale-[0.96]"
                  style={{
                    background: deadline === d.value ? "var(--sov-accent-dim)" : "var(--sov-surface-2)",
                    border: `1px solid ${deadline === d.value ? "var(--sov-accent)" : "var(--sov-border)"}`,
                    color: deadline === d.value ? "var(--sov-accent)" : "var(--sov-text-secondary)",
                  }}>
                  {d.label}
                </button>
              ))}
            </div>

            <NextButton onClick={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <SectionTitle icon={<DollarSign size={16} />} title="Auto Estimate" />

            <div className="rounded-2xl p-5 mb-6"
              style={{ background: "var(--sov-surface)", border: "1px solid var(--sov-border-bright)" }}>

              <div className="mb-5">
                <p className="text-[10px] font-bold mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Estimated Cost
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--sov-accent)" }}>
                    ₹{estimate.min.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--sov-text-muted)" }}>
                    — ₹{estimate.max.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[10px] font-bold mb-1" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Estimated Delivery
                </p>
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {estimate.weeks} weeks
                </span>
              </div>

              <div className="h-px my-4" style={{ background: "var(--sov-border)" }} />

              <p className="text-[10px] font-bold mb-2" style={{ color: "var(--sov-text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Breakdown
              </p>
              {selectedTypes.length > 0 && (
                <div className="space-y-1 mb-2">
                  {selectedTypes.map((t) => (
                    <div key={t} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--sov-text-secondary)" }}>{t}</span>
                      <Globe size={12} style={{ color: "var(--sov-accent)" }} />
                    </div>
                  ))}
                </div>
              )}
              {selectedFeatures.length > 0 && (
                <div className="space-y-1">
                  {selectedFeatures.map((f) => (
                    <div key={f} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--sov-text-secondary)" }}>{f}</span>
                      <Rocket size={12} style={{ color: "var(--sov-accent)" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[10px] mb-6 text-center" style={{ color: "var(--sov-text-muted)" }}>
              * This is an auto-generated estimate. Final pricing discussed after consultation.
            </p>

            <NextButton onClick={() => setStep(3)} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <SectionTitle icon={<Phone size={16} />} title="Contact & Submit" />

            <div className="space-y-3 mb-6">
              <FormInput icon={<Briefcase size={16} />} placeholder="Your Name" value={contactName} onChange={setContactName} />
              <FormInput icon={<Phone size={16} />} placeholder="Phone Number" value={contactPhone} onChange={setContactPhone} type="tel" />
              <FormInput icon={<MessageSquare size={16} />} placeholder="Email" value={contactEmail} onChange={setContactEmail} type="email" />
              <FormInput icon={<Calendar size={16} />} placeholder="WhatsApp (optional)" value={contactWhatsapp} onChange={setContactWhatsapp} type="tel" />
            </div>

            <button onClick={handleSubmit} disabled={loading || !contactName || !contactPhone || !contactEmail}
              className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: "var(--sov-accent)", color: "#000" }}>
              {loading ? (
                <motion.div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              ) : (
                <>Submit Project</>
              )}
            </button>

            <p className="text-[10px] mt-3 text-center" style={{ color: "var(--sov-text-muted)" }}>
              We&apos;ll contact you within 24 hours to discuss your project.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--sov-accent-dim)" }}>
        <span style={{ color: "var(--sov-accent)" }}>{icon}</span>
      </div>
      <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
    </div>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full h-13 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      style={{ background: "var(--sov-accent)", color: "#000", height: "52px" }}>
      Continue <ArrowRight size={16} />
    </button>
  );
}

function FormInput({ icon, placeholder, value, onChange, type = "text" }: {
  icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--sov-text-muted)" }}>{icon}</div>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-12 pr-4 rounded-xl text-sm font-medium outline-none transition-all"
        style={{ background: "var(--sov-surface-2)", border: "1px solid var(--sov-border-bright)", color: "var(--sov-text)" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--sov-accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--sov-border-bright)")} />
    </div>
  );
}
