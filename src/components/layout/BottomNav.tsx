"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Layers,
  ListTodo,
  Calendar,
  Award,
  ShieldAlert,
} from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole } = useApp();

  const navItems = [
    { name: "Today", href: "/", icon: Layers },
    { name: "Roadmap", href: "/roadmap", icon: ListTodo },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Ranks", href: "/leaderboard", icon: Award },
  ];

  if (currentRole === "admin") {
    navItems.push({ name: "Admin", href: "/admin", icon: ShieldAlert });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-100 px-3 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive ? "text-neutral-900 font-semibold" : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-neutral-100" : "bg-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
