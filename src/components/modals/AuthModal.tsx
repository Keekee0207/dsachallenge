"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  CheckCircle2,
  Edit2,
  RefreshCw,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { sendEmailOtp, verifyEmailOtp } = useApp();
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setDemoCode(null);

    const clean = emailInput.trim().toLowerCase();
    if (!clean) return;

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

    setSuccessMsg(`A 6-digit verification code was sent to ${clean}.`);
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOtp = otpInput.trim();
    if (!cleanOtp) {
      setErrorMsg("Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    const res = await verifyEmailOtp(emailInput.trim(), cleanOtp);
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Invalid code. Please try again.");
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
            Verified Authentication
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-neutral-900 mb-1">
          {step === "email" ? "Sign In with Email" : "Enter Verification Code"}
        </h3>

        <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
          {step === "email"
            ? "Enter your registered email address to receive a secure 6-digit verification code."
            : `Enter the 6-digit code sent to ${emailInput}`}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {demoCode && (
          <div className="mb-4 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <span>Demo Code: <strong className="font-mono">{demoCode}</strong></span>
            <button
              type="button"
              onClick={() => setOtpInput(demoCode)}
              className="text-[11px] underline font-semibold"
            >
              Auto-fill
            </button>
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-3.5">
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-950 bg-white"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{isLoading ? "Sending Code..." : "Send Verification Code"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-in fade-in">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 pl-10 pr-4 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-950 bg-white"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-950 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{isLoading ? "Verifying..." : "Verify Code & Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => handleSendCode()}
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change email</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Strict allowlist enforcement</span>
        </div>
      </div>
    </div>
  );
};
