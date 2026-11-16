"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Lock, AlertCircle, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";

export const SignInScreen: React.FC = () => {
  const { loginAs, allowedEmails, signInWithGoogle } = useApp();
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showDevShortcuts, setShowDevShortcuts] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    const res = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = emailInput.trim().toLowerCase();
    if (!clean) return;

    const ok = loginAs(clean);
    if (!ok) {
      setErrorMsg(
        `Access Denied: "${emailInput}" is not an authorized email. This platform is strictly private to the 4 invited participants and organizer.`
      );
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="habit-card rounded-3xl max-w-md w-full p-6 sm:p-9 border border-neutral-200/90 shadow-elevated bg-white">
        {/* Top Header Pill */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Lock className="w-3 h-3 text-neutral-300" />
            <span>Private Cohort Gate</span>
          </div>
        </div>

        {/* Minimal Habit Tracker Logo & Greeting */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center mx-auto mb-3 shadow-sm font-bold text-lg font-mono">
            50
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            50 Days DSA Challenge
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Nov 21, 2026 – Jan 9, 2027. Sign in with your registered account to access your challenge dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Primary Action: Continue with Google */}
        <div className="mb-5">
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.99]"
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

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-neutral-100 w-full" />
          <span className="bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            or sign in with email
          </span>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3 mb-6">
          <div>
            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-950 bg-white placeholder:text-neutral-400 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Sign In with Email</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Restricted to authorized cohort participants</span>
        </div>

        {/* Collapsed Local Dev Shortcuts (Only for manual testing on localhost, hidden by default) */}
        <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
          <button
            type="button"
            onClick={() => setShowDevShortcuts(!showDevShortcuts)}
            className="text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors inline-flex items-center gap-1"
          >
            <span>Local testing shortcuts</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showDevShortcuts ? "rotate-180" : ""}`}
            />
          </button>

          {showDevShortcuts && (
            <div className="mt-2 space-y-1.5 p-2 rounded-xl bg-neutral-50 text-left animate-in fade-in">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                Click to test as:
              </span>
              {allowedEmails.map((allowed) => (
                <button
                  key={allowed.id}
                  onClick={() => loginAs(allowed.email)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white text-[11px] text-neutral-700 flex items-center justify-between border border-transparent hover:border-neutral-200 transition-all"
                >
                  <span className="font-medium truncate">{allowed.name}</span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">
                    {allowed.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
