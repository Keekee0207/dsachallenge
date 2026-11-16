"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Calendar as CalendarIcon,
  Flame,
  Award,
  ListTodo,
  ShieldAlert,
  Clock,
  User,
  LogOut,
  Sliders,
  ChevronDown,
  Layers,
} from "lucide-react";

interface NavbarProps {
  onOpenAuthModal: () => void;
  onOpenDateSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuthModal,
  onOpenDateSimulator,
}) => {
  const pathname = usePathname();
  const {
    currentUser,
    currentRole,
    challengeInfo,
    simulatedDate,
    logout,
    currentUserStats,
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: Layers },
    { name: "Roadmap", href: "/roadmap", icon: ListTodo },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Leaderboard", href: "/leaderboard", icon: Award },
  ];

  if (currentRole === "admin") {
    navItems.push({ name: "Admin", href: "/admin", icon: ShieldAlert });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100">
      {/* Top micro-banner for Simulation / Demo Notification */}
      {simulatedDate && (
        <div className="bg-neutral-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Clock className="w-3.5 h-3.5 text-neutral-300" />
          <span>
            Preview Mode Active: Simulating{" "}
            <strong>
              {challengeInfo.currentDay > 0
                ? `Day ${challengeInfo.currentDay}`
                : "Pre-Challenge Countdown"}
            </strong>{" "}
            ({challengeInfo.todayDateFormatted})
          </span>
          <button
            onClick={onOpenDateSimulator}
            className="underline hover:text-neutral-300 ml-2 text-[11px]"
          >
            Change / Reset
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              50
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-neutral-900">
                50 Days DSA
              </span>
              <span className="text-[10px] text-neutral-500 tracking-wider uppercase font-medium">
                Challenge Tracker
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - ONLY visible after signing in */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <>
              {/* Day / Timeline Badge */}
              <button
                onClick={onOpenDateSimulator}
                title="Click to simulate challenge days"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-medium transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                <span>
                  {challengeInfo.isUpcoming
                    ? `Starts in ${challengeInfo.daysUntilStart}d`
                    : challengeInfo.hasEnded
                    ? "Challenge Ended"
                    : `Day ${challengeInfo.currentDay} of 50`}
                </span>
              </button>

              {/* Streak pill if logged in */}
              {currentUserStats && currentUser.role === "participant" && (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/70 text-xs font-semibold text-neutral-800">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{currentUserStats.current_streak}d streak</span>
                </div>
              )}

              {/* User Account / Profile Button */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 bg-white transition-all text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-medium text-[11px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-semibold text-neutral-900 leading-tight">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-neutral-500 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-neutral-100 shadow-elevated p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                      <p className="font-semibold text-neutral-900">{currentUser.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 uppercase tracking-wider">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenDateSimulator();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                      Simulate Date / Day
                    </button>

                    <div className="border-t border-neutral-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                🔒 Private Access
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
