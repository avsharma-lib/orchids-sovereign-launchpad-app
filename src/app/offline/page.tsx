"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="app-container flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-sm"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-red-500/20 bg-red-500/10">
          <WifiOff size={40} className="text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-display)" }}>
            You are Offline
          </h1>
          <p className="text-sm text-gray-400">
            Sovereign Launchpad requires an active internet connection to access projects and secure database queries.
          </p>
        </div>

        {isOnline ? (
          <p className="text-xs text-lime-400 font-bold">
            Connection restored! You can now reload.
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Please check your Wi-Fi or cellular network.
          </p>
        )}

        <button
          onClick={handleRetry}
          className="w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-black"
          style={{ background: "var(--sov-accent)" }}
        >
          <RefreshCw size={18} /> Try Again
        </button>
      </motion.div>
    </div>
  );
}
