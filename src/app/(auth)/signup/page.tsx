"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Phone, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

const steps = ["Phone", "Details", "Done"];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneContinue = () => {
    if (phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    setError("");
    setStep(1);
  };

  const handleCreateAccount = async () => {
    if (!fullName.trim()) { setError("Name is required"); return; }
    if (!email.includes("@")) { setError("Valid email required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }

    setLoading(true);
    setError("");
    const result = await signup({ full_name: fullName, phone, email, password });
    setLoading(false);

    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Signup failed");
    }
  };

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  return (
    <div className="app-container flex flex-col min-h-dvh px-6 pt-24 pb-8">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Sovereign<span style={{ color: "var(--sov-accent)" }}>.</span>
        </h1>
      </motion.div>

      <div className="flex-1 flex flex-col justify-start">
        {/* Stepper (CENTER FIXED) */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full flex justify-center mb-8"
        >
          <div className="w-full max-w-2xl flex items-center justify-between relative">
            {steps.map((label, i) => (
              <Fragment key={label}>
                <div className="relative flex flex-col items-center z-10">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 relative"
                    style={{
                      background: i <= step ? "var(--sov-accent)" : "var(--sov-surface-2)",
                      color: i <= step ? "#000" : "var(--sov-text-secondary)",
                      boxShadow: i === step ? "0 0 20px rgba(191,255,0,0.3)" : "none",
                    }}
                  >
                    {i < step ? <CheckCircle2 size={18} /> : i + 1}
                  </div>

                  <span
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max text-center text-[10px] font-medium"
                    style={{
                      color: i <= step ? "var(--sov-accent)" : "var(--sov-text-muted)",
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-4 rounded-full overflow-hidden" style={{ background: "var(--sov-surface-2)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--sov-accent)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: i < step ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <div className="w-full flex flex-col">
          <AnimatePresence mode="wait">

            {/* STEP 0 (CENTER FIXED) */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 w-full flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
                Get started
              </h2>

              <p className="text-sm text-center mb-6" style={{ color: "var(--sov-text-secondary)" }}>
                Enter your phone number to create an account
              </p>

              <div className="space-y-4 w-full">
                <div className="relative w-full">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--sov-text-muted)" }} />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-14 pl-12 pr-4 rounded-xl text-base font-medium outline-none transition-all"
                    style={{
                      background: "var(--sov-surface-2)",
                      border: "1px solid var(--sov-border-bright)",
                      color: "var(--sov-text)",
                    }}
                  />
                </div>

                {error && (
                  <p className="text-xs text-center" style={{ color: "var(--sov-danger)" }}>{error}</p>
                )}

                <button
                  onClick={handlePhoneContinue}
                  className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2"
                  style={{ background: "var(--sov-accent)", color: "#000" }}
                >
                  Continue <ArrowRight size={18} />
                </button>

                <p className="text-sm text-center" style={{ color: "var(--sov-text-secondary)" }}>
                  Already have an account? <Link href="/login" style={{ color: "var(--sov-accent)" }}>Login</Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 1 (CENTER FIXED) */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 w-full flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2 text-center">Your details</h2>

              <div className="space-y-3 w-full">
                <InputField icon={<User size={18} />} placeholder="Full Name" value={fullName} onChange={setFullName} />
                <InputField icon={<Mail size={18} />} placeholder="Email" type="email" value={email} onChange={setEmail} />
                <InputField icon={<Lock size={18} />} placeholder="Password" type="password" value={password} onChange={setPassword} />
                <InputField icon={<Lock size={18} />} placeholder="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
              </div>

              {error && <p className="text-xs text-center mt-3" style={{ color: "var(--sov-danger)" }}>{error}</p>}

              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full h-14 rounded-xl mt-6 font-bold"
                style={{ background: "var(--sov-accent)", color: "#000" }}
              >
                Create Account
              </button>
            </motion.div>
          )}

          {/* STEP 2 (CENTER FIXED) */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 w-full flex flex-col items-center justify-center text-center"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "rgba(191,255,0,0.1)",
                  color: "var(--sov-accent)",
                }}
              >
                <CheckCircle2 size={48} />
              </div>

              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                You&apos;re all set!
              </h2>

              <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--sov-text-secondary)" }}>
                Your account has been successfully created. Welcome to Sovereign.
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2"
                style={{ background: "var(--sov-accent)", color: "#000" }}
              >
                Continue to App <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text", value, onChange }) {
  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--sov-text-muted)" }}>
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 pl-12 pr-4 rounded-xl text-base font-medium outline-none"
        style={{
          background: "var(--sov-surface-2)",
          border: "1px solid var(--sov-border-bright)",
          color: "var(--sov-text)",
        }}
      />
    </div>
  );
}
