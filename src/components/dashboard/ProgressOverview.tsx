"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/ui/StatCard";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { CheckCircle2, Flame, Trophy, Percent } from "lucide-react";

export const ProgressOverview: React.FC = () => {
  const { currentUserStats, challengeInfo } = useApp();

  const completedCount = currentUserStats?.completed_count || 0;
  const currentStreak = currentUserStats?.current_streak || 0;
  const longestStreak = currentUserStats?.longest_streak || 0;
  const completionPercentage = currentUserStats?.completion_percentage || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* 1. Problems Completed */}
      <StatCard
        title="Completed"
        value={`${completedCount}/50`}
        subtitle={`${50 - completedCount} problems remaining`}
        icon={<CheckCircle2 className="w-4 h-4 text-neutral-400" />}
        gauge={
          <div className="hidden sm:block">
            <CircularProgress value={completionPercentage} size={54} strokeWidth={5} />
          </div>
        }
      />

      {/* 2. Current Streak */}
      <StatCard
        title="Current Streak"
        value={`${currentStreak} ${currentStreak === 1 ? "day" : "days"}`}
        subtitle={
          currentStreak > 0
            ? "Momentum is active"
            : challengeInfo.isUpcoming
            ? "Awaiting Day 1 kickoff"
            : "Solve today to start streak"
        }
        icon={<Flame className="w-4 h-4 text-amber-500 fill-amber-500" />}
        trend={currentStreak >= 7 ? "🔥 On Fire" : undefined}
      />

      {/* 3. Longest Streak */}
      <StatCard
        title="Longest Streak"
        value={`${longestStreak} ${longestStreak === 1 ? "day" : "days"}`}
        subtitle="Personal best consistency"
        icon={<Trophy className="w-4 h-4 text-neutral-400" />}
      />

      {/* 4. Completion Rate */}
      <StatCard
        title="Completion"
        value={`${completionPercentage}%`}
        subtitle={`Day ${challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 0} target pace`}
        icon={<Percent className="w-4 h-4 text-neutral-400" />}
        gauge={
          <div className="hidden sm:block">
            <div className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-800">
              {completionPercentage}%
            </div>
          </div>
        }
      />
    </div>
  );
};
