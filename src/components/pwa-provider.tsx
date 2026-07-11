"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // 1. Register Service Worker in production
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register sw.js
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg);

          // Check if there is an update waiting
          if (reg.waiting) {
            setShowUpdateBanner(true);
          }

          // Listen for new service worker installs
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // A new service worker is installed and waiting to activate
                  setShowUpdateBanner(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error("Service worker registration failed:", err);
        });

      // Reload page when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 2. Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if already in standalone/PWA mode
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      if (!isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleUpdateClick = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  };

  return (
    <>
      {children}

      {/* Floating Install App Banner */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-4 rounded-2xl shadow-2xl flex items-center justify-between border"
             style={{ background: "var(--sov-surface-2)", borderColor: "var(--sov-border-bright)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold"
                 style={{ background: "var(--sov-accent)" }}>
              S
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Sovereign Launchpad</p>
              <p className="text-[10px]" style={{ color: "var(--sov-text-muted)" }}>Install app for quick access & offline use</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-black"
              style={{ background: "var(--sov-accent)" }}
            >
              <Download size={12} /> Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating SW Update Available Banner */}
      {showUpdateBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-4 rounded-2xl shadow-2xl flex items-center justify-between border"
             style={{ background: "var(--sov-surface-2)", borderColor: "var(--sov-border-bright)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold animate-spin"
                 style={{ background: "var(--sov-accent)" }}>
              <RefreshCw size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Update Available</p>
              <p className="text-[10px]" style={{ color: "var(--sov-text-muted)" }}>A new version has been installed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdateClick}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-black whitespace-nowrap"
              style={{ background: "var(--sov-accent)" }}
            >
              Update Now
            </button>
            <button
              onClick={() => setShowUpdateBanner(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
