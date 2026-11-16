"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

interface AccessDeniedProps {
  onOpenAuthModal?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ onOpenAuthModal }) => {
  const { deniedEmail, clearAccessDenied } = useApp();

  const handleBack = () => {
    clearAccessDenied();
    if (onOpenAuthModal) onOpenAuthModal();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="habit-card rounded-3xl max-w-md w-full p-8 text-center border border-neutral-200 bg-white shadow-elevated">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-5 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Private Cohort Restricted</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
          Access Denied
        </h2>

        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
          The email <strong className="text-neutral-900">{deniedEmail || "you entered"}</strong> is
          not authorized to access the 50 Days DSA Challenge.
        </p>

        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          This platform is an accountability cohort limited exclusively to four selected
          participants. If you believe this is an error, please ask the challenge organizer to add
          your email to the allowlist.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Try an Authorized Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
