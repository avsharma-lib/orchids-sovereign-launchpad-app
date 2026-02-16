"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Phone, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sovereign<span style={{ color: "var(--sov-accent)" }}>.</span>
        </h1>
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-0 mb-10 max-w-2xl mx-auto w-full"
      >
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500"
                style={{
                  background: i <= step ? "var(--sov-accent)" : "var(--sov-surface-2)",
                  color: i <= step ? "#000" : "var(--sov-text-secondary)",
                  boxShadow: i === step ? "0 0 20px rgba(191,255,0,0.3)" : "none",
                }}
              >
                {i < step ? (
                  <CheckCircle2 size={18} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="text-[10px] font-medium"
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
              <div className="flex-1 h-[2px] mx-1 rounded-full overflow-hidden" style={{ background: "var(--sov-surface-2)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--sov-accent)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Get started
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--sov-text-secondary)" }}>
                Enter your phone number to create an account
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--sov-text-muted)" }}
                  />
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
                    onFocus={(e) => (e.target.style.borderColor = "var(--sov-accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--sov-border-bright)")}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium"
                    style={{ color: "var(--sov-danger)" }}
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={handlePhoneContinue}
                  className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{
                    background: "var(--sov-accent)",
                    color: "#000",
                  }}
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: "var(--sov-text-secondary)" }}>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold"
                    style={{ color: "var(--sov-accent)" }}
                  >
                    Login
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your details
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--sov-text-secondary)" }}>
                Complete your profile to get started
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  icon={<User size={18} />}
                  placeholder="Full Name"
                  value={fullName}
                  onChange={setFullName}
                />
                <InputField
                  icon={<Mail size={18} />}
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--sov-text-muted)" }}
                  />
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
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--sov-text-muted)" }}
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 rounded-xl text-base font-medium outline-none transition-all"
                    style={{
                      background: "var(--sov-surface-2)",
                      border: "1px solid var(--sov-border-bright)",
                      color: "var(--sov-text)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--sov-accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--sov-border-bright)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--sov-text-muted)" }}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 mt-6 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "var(--sov-accent)",
                  color: "#000",
                }}
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>Create Account</>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: "var(--sov-text-secondary)" }}>
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold" style={{ color: "var(--sov-accent)" }}>
                    Login
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "rgba(0,230,118,0.12)",
                  border: "2px solid rgba(0,230,118,0.3)",
                }}
              >
                <CheckCircle2 size={48} style={{ color: "var(--sov-success)" }} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Signup Successful
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm mb-10"
                style={{ color: "var(--sov-text-secondary)" }}
              >
                Your account has been created. Welcome aboard.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => router.push("/login")}
                className="w-full h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background: "var(--sov-accent)",
                  color: "#000",
                }}
              >
                Continue to App
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputField({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: "var(--sov-text-muted)" }}
      >
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  );
}
