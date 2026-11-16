"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Lock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAs, signInWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    const res = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = customEmail.trim().toLowerCase();
    if (!clean) return;

    const success = loginAs(clean);
    if (success) {
      onClose();
    } else {
      setErrorMsg(
        `Access Denied: "${customEmail}" is not an authorized email for this private cohort.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-neutral-200 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Account Access
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-neutral-900 mb-1">
          Sign In
        </h3>

        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          Sign in with your authorized Google account or registered participant email.
        </p>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Primary Action: Google Sign-In */}
        <div className="mb-5">
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold text-xs sm:text-sm transition-all shadow-xs group"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-neutral-100 w-full" />
          <span className="bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            or with email
          </span>
        </div>

        {/* Custom Email Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-950 bg-white"
            required
          />
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Strict allowlist enforcement</span>
        </div>
      </div>
    </div>
  );
};
