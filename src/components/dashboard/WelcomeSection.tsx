"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Flame, Sparkles, CheckCircle2 } from "lucide-react";

export const WelcomeSection: React.FC = () => {
  const { currentUser, challengeInfo, currentUserStats } = useApp();

  // Get current hour for time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const name = currentUser ? currentUser.name.split(" ")[0] : "Participant";

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
              <Sparkles className="w-3 h-3 text-neutral-500" />
              <span>50 Days of Consistency</span>
            </span>
            {currentUserStats && currentUserStats.current_streak > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/60">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>{currentUserStats.current_streak} Day Streak</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
            {getGreeting()}, {name}.
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 mt-1 font-normal">
            {challengeInfo.isUpcoming
              ? `The journey begins on November 21. Prepare your mind and environment.`
              : challengeInfo.hasEnded
              ? `Challenge complete! You proved what 50 days of dedication looks like.`
              : `Day ${challengeInfo.currentDay} of 50. Keep showing up.`}
          </p>
        </div>

        {/* Motivational Accountability Motto */}
        <div className="hidden sm:block text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-neutral-100 shadow-subtle text-xs text-neutral-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
            <span className="font-medium">One Problem. Every Single Day.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
