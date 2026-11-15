"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CircularProgress } from "@/components/ui/CircularProgress";
import {
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Trophy,
  Users,
  Sparkles,
} from "lucide-react";

export const LeaderboardView: React.FC = () => {
  const { participantStats, challengeInfo, currentUser } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold mb-2">
          <Award className="w-3.5 h-3.5 text-neutral-300" />
          <span>PROGRESS &amp; LEADERBOARD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Cohort Standings &amp; Momentum
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Rankings are determined by total problems completed, with active streaks as the primary
          tie-breaker.
        </p>
      </div>

      {/* Podium / Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {participantStats.map((stat, index) => {
          const isCurrentUser = currentUser?.id === stat.participant_id;
          const rank = index + 1;

          return (
            <div
              key={stat.participant_id}
              className={`habit-card rounded-3xl p-6 border transition-all relative flex flex-col justify-between ${
                isCurrentUser
                  ? "border-neutral-950 bg-white ring-1 ring-neutral-900 shadow-sm"
                  : "border-neutral-200/80 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      rank === 1
                        ? "bg-amber-400 text-neutral-950"
                        : rank === 2
                        ? "bg-neutral-200 text-neutral-800"
                        : rank === 3
                        ? "bg-amber-700/20 text-amber-900"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    #{rank}
                  </div>
                  {isCurrentUser && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-900">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-sm">
                    {stat.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 leading-tight">
                      {stat.name}
                    </h3>
                    <span className="text-[11px] text-neutral-400">
                      {stat.completed_count}/50 Completed
                    </span>
                  </div>
                </div>

                {/* Circular completion gauge matching reference Screen 3 */}
                <div className="flex items-center justify-center py-3">
                  <CircularProgress
                    value={stat.completion_percentage}
                    size={72}
                    strokeWidth={6}
                    label={`${stat.completed_count}/50`}
                  />
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-neutral-50">
                  <span className="text-[10px] text-neutral-400 block font-medium">Streak</span>
                  <div className="flex items-center justify-center gap-1 font-bold text-xs text-neutral-900">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{stat.current_streak}d</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50">
                  <span className="text-[10px] text-neutral-400 block font-medium">Best</span>
                  <div className="flex items-center justify-center gap-1 font-bold text-xs text-neutral-900">
                    <Trophy className="w-3 h-3 text-neutral-400" />
                    <span>{stat.longest_streak}d</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Table */}
      <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80 overflow-hidden">
        <h3 className="text-base font-bold text-neutral-900 mb-4">
          Detailed Cohort Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Participant</th>
                <th className="py-3 px-3 text-center">Completed</th>
                <th className="py-3 px-3 text-center">Current Streak</th>
                <th className="py-3 px-3 text-center">Longest Streak</th>
                <th className="py-3 px-3 text-center">Missed Days</th>
                <th className="py-3 px-3 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {participantStats.map((stat, idx) => {
                const isCurrentUser = currentUser?.id === stat.participant_id;

                return (
                  <tr
                    key={stat.participant_id}
                    className={`hover:bg-neutral-50/70 transition-colors ${
                      isCurrentUser ? "bg-neutral-50/50 font-semibold" : ""
                    }`}
                  >
                    <td className="py-4 px-3 font-mono font-bold text-neutral-800">
                      #{idx + 1}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-bold">
                          {stat.name.charAt(0)}
                        </div>
                        <span className="text-neutral-900">{stat.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-neutral-900">
                      {stat.completed_count} <span className="text-neutral-400 font-normal">/ 50</span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-semibold text-[11px] border border-amber-200/50">
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {stat.current_streak} days
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center font-medium text-neutral-700">
                      {stat.longest_streak} days
                    </td>
                    <td className="py-4 px-3 text-center text-neutral-500">
                      {stat.missed_days.length > 0 ? (
                        <span className="text-rose-600 font-medium">
                          {stat.missed_days.length} days
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">0 days</span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-bold text-neutral-900">
                          {stat.completion_percentage}%
                        </span>
                        <div className="w-16 h-2 rounded-full bg-neutral-100 overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-neutral-950 rounded-full"
                            style={{ width: `${stat.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
