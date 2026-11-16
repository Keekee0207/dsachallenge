"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const SignInScreen: React.FC = () => {
  const { signInWithGoogle, isSupabaseConnected, loginAs, allowedEmails } = useApp();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocalDevBypass, setShowLocalDevBypass] = useState(false);

  useEffect(() => {
    if (searchParams.get("auth_error")) {
      setErrorMsg("Google sign-in could not be completed. Please ensure your Supabase redirect URLs and Google Cloud credentials are saved, then try again.");
    }
  }, [searchParams]);

  // Sign in through Google Authentication
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    const res = await signInWithGoogle();
    if (!res.success && res.error) {
      setErrorMsg(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="habit-card rounded-3xl max-w-md w-full p-6 sm:p-9 border border-neutral-200/90 shadow-elevated bg-white">
        {/* Top Header Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Lock className="w-3 h-3 text-neutral-300" />
            <span>Google Authentication</span>
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

          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Sign in with your registered Google account. Once signed in on your device, you can directly access your dashboard anytime.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold block mb-0.5">Authentication Note</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* PRIMARY ACTION: Sign In through Google */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold text-sm transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
            <span>{isLoading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
            Choose your Gmail account. Access is restricted to the 4 registered participants and organizer.
          </p>
        </div>

        {/* Local Dev / Offline Test Helper (Only visible if Supabase is not connected in .env.local) */}
        {!isSupabaseConnected && (
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <button
              onClick={() => setShowLocalDevBypass(!showLocalDevBypass)}
              className="w-full text-center text-[11px] text-neutral-400 hover:text-neutral-700 flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Offline / Local Preview Mode</span>
            </button>

            {showLocalDevBypass && (
              <div className="mt-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2 animate-in fade-in">
                <p className="text-[11px] text-neutral-500 font-medium">
                  Supabase keys not yet in local <code>.env.local</code>. Click an account to preview locally:
                </p>
                <div className="space-y-1.5 pt-1">
                  {allowedEmails.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => loginAs(a.email)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-900 text-left transition-colors"
                    >
                      <span className="font-semibold text-neutral-900">{a.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[140px]">
                        {a.email}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Footer Notice */}
        <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          <span>Strict allowlist enforcement • No passwords needed</span>
        </div>
      </div>
    </div>
  );
};
