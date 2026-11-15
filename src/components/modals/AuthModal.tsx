"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, User, Shield, Check, Lock, AlertCircle, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAs, allowedEmails, currentUser, isSupabaseConnected } = useApp();
  const [customEmail, setCustomEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!customEmail.trim()) return;

    const success = loginAs(customEmail.trim());
    if (success) {
      onClose();
    } else {
      setErrorMsg(
        `Access Denied: "${customEmail}" is not on the private participant allowlist. Please contact the challenge administrator.`
      );
    }
  };

  const handleSelectPreset = (email: string) => {
    setErrorMsg(null);
    const success = loginAs(email);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-elevated border border-neutral-200 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Private Access Gate
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-neutral-900 mb-1">
          Sign In to Challenge
        </h3>

        <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
          Access is strictly restricted to the four registered participants and the challenge organizer.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Switch Allowed Accounts */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
            Switch Authorized Profile
          </span>
          <div className="space-y-2">
            {allowedEmails.map((allowed) => {
              const isCurrent = currentUser?.email.toLowerCase() === allowed.email.toLowerCase();
              return (
                <button
                  key={allowed.id}
                  onClick={() => handleSelectPreset(allowed.email)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isCurrent
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-xs"
                      : "border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? "bg-white text-neutral-950"
                          : allowed.role === "admin"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {allowed.role === "admin" ? (
                        <Shield className="w-3.5 h-3.5" />
                      ) : (
                        allowed.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{allowed.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase font-medium ${
                            isCurrent
                              ? "bg-neutral-800 text-neutral-200"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {allowed.role}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] ${
                          isCurrent ? "text-neutral-400" : "text-neutral-500"
                        }`}
                      >
                        {allowed.email}
                      </span>
                    </div>
                  </div>

                  {isCurrent && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Email Input (for testing unauthorized emails or custom accounts) */}
        <form onSubmit={handleCustomLogin} className="pt-3 border-t border-neutral-100">
          <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1.5">
            Or test any email (e.g. unauthorized)
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="user@example.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1"
            >
              <span>Test</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
