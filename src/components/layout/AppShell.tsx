"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthModal } from "@/components/modals/AuthModal";
import { DateSimulatorModal } from "@/components/modals/DateSimulatorModal";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { SignInScreen } from "@/components/auth/SignInScreen";
import { useApp } from "@/context/AppContext";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { isAccessDenied, currentUser, loginAs } = useApp();
  const searchParams = useSearchParams();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dateSimModalOpen, setDateSimModalOpen] = useState(false);

  useEffect(() => {
    const deniedParam = searchParams.get("access_denied");
    if (deniedParam) {
      loginAs(deniedParam);
    }
  }, [searchParams, loginAs]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenDateSimulator={() => setDateSimModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 mb-20 md:mb-12">
        {isAccessDenied ? (
          <AccessDenied onOpenAuthModal={() => setAuthModalOpen(true)} />
        ) : !currentUser ? (
          <SignInScreen />
        ) : (
          children
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <DateSimulatorModal
        isOpen={dateSimModalOpen}
        onClose={() => setDateSimModalOpen(false)}
      />

      {currentUser && <BottomNav />}
    </div>
  );
}

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
};
