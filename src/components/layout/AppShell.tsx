"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthModal } from "@/components/modals/AuthModal";
import { DateSimulatorModal } from "@/components/modals/DateSimulatorModal";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { useApp } from "@/context/AppContext";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { isAccessDenied } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dateSimModalOpen, setDateSimModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenDateSimulator={() => setDateSimModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 mb-20 md:mb-12">
        {isAccessDenied ? (
          <AccessDenied onOpenAuthModal={() => setAuthModalOpen(true)} />
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

      <BottomNav />
    </div>
  );
};
