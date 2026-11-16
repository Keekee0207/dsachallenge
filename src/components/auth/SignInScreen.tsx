"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Edit2,
} from "lucide-react";

export const SignInScreen: React.FC = () => {
  const { sendEmailOtp, verifyEmailOtp } = useApp();
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request 6-digit verification code to email
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setDemoCode(null);

    const clean = emailInput.trim().toLowerCase();
    if (!clean) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    const res = await sendEmailOtp(clean);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Unable to send verification code. Please check your email.");
      return;
    }

    if (res.demoCode) {
      setDemoCode(res.demoCode);
    }

    setSuccessMsg(`A 6-digit verification code was sent to ${clean}. Please check your inbox.`);
    setStep("otp");
  };

  // Step 2: Verify the 6-digit code (must be verified from email inbox)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOtp = otpInput.trim();
    if (!cleanOtp) {
      setErrorMsg("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setIsLoading(true);
    const res = await verifyEmailOtp(emailInput.trim(), cleanOtp);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Invalid verification code. Please check your inbox and try again.");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="habit-card rounded-3xl max-w-md w-full p-6 sm:p-9 border border-neutral-200/90 shadow-elevated bg-white">
        {/* Top Header Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Lock className="w-3 h-3 text-neutral-300" />
            <span>Email Verification Required</span>
          </div>
        </div>

        {/* Logo & Heading */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center mx-auto mb-3 shadow-sm font-bold text-lg font-mono">
            50
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            50 Days DSA Challenge
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Nov 21, 2026 – Jan 9, 2027 • Private Accountability Cohort
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Success / OTP Sent Notification */}
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{successMsg}</span>
          </div>
        )}

        {/* Demo Mode Helper (Only when Supabase API keys not configured) */}
        {demoCode && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between animate-in fade-in">
            <span className="font-medium">
              Demo Code: <strong className="font-mono text-sm tracking-wider">{demoCode}</strong>
            </span>
            <button
              type="button"
              onClick={() => setOtpInput(demoCode)}
              className="text-[11px] underline font-semibold text-amber-900 hover:text-amber-950"
            >
              Auto-fill code
            </button>
          </div>
        )}

        {step === "email" ? (
          /* STEP 1: Enter Registered Email Address */
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  placeholder="e.g. yourname@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-950 bg-white placeholder:text-neutral-400 font-medium"
                  required
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed pt-0.5">
                A 6-digit one-time code will be sent to this email to verify that you own the inbox.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              <span>{isLoading ? "Sending 6-digit code..." : "Send Verification Code"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: Enter 6-digit OTP Code from Inbox */
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700">6-Digit Code</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setDemoCode(null);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change email</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                <span className="font-mono truncate">{emailInput}</span>
                <span className="text-[10px] uppercase font-semibold text-neutral-400 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                  Inbox
                </span>
              </div>

              <div className="relative mt-2">
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[0.4em] font-mono text-xl sm:text-2xl font-bold py-2.5 pl-10 pr-4 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-950 bg-white"
                  required
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-neutral-400 text-center pt-1">
                Open your email inbox and enter the 6 digits.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              <span>{isLoading ? "Verifying..." : "Verify Code & Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => handleSendCode()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtpInput("");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setDemoCode(null);
                }}
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Back to email
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          <span>Strictly restricted to the 4 participants & organizer</span>
        </div>
      </div>
    </div>
  );
};
