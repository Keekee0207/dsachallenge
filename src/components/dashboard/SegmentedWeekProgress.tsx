"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Problem, Submission } from "@/types";
import { CheckCircle2, Lock } from "lucide-react";

export const SegmentedWeekProgress: React.FC = () => {
  const { challengeInfo, problems, currentUser, submissions } = useApp();

  const currentDay = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;
  const currentWeekNumber = Math.min(8, Math.max(1, Math.ceil(currentDay / 7)));

  // Get current week's 7 problems
  const currentWeekProblems = problems.filter((p) => p.week_number === currentWeekNumber);

  return (
    <div className="habit-card rounded-3xl p-6 sm:p-7 mb-8 border border-neutral-200/80">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            This Week
          </span>
          <h3 className="text-lg font-bold tracking-tight text-neutral-900 mt-0.5">
            Week {currentWeekNumber} Progress
          </h3>
        </div>
        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
          7-Day Tracker
        </span>
      </div>

      <div className="space-y-4">
        {currentWeekProblems.map((problem) => {
          const isToday = problem.day_number === currentDay;
          const isFuture = problem.day_number > currentDay;
          const userSub = currentUser
            ? submissions.find(
                (s) =>
                  s.participant_id === currentUser.id &&
                  s.challenge_day === problem.day_number
              )
            : null;
          const isCompleted = !!userSub;

          return (
            <div
              key={problem.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-1.5"
            >
              <div className="flex items-center gap-2.5 min-w-[200px]">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isCompleted
                      ? "bg-neutral-900"
                      : isToday
                      ? "bg-amber-500 animate-pulse"
                      : "bg-neutral-300"
                  }`}
                />
                <span className="text-xs font-medium text-neutral-800 truncate">
                  Day {problem.day_number} — {problem.title}
                </span>
              </div>

              {/* Segmented 7-bar progress bar matching reference image */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((segmentIndex) => {
                  const targetDay = (currentWeekNumber - 1) * 7 + segmentIndex;
                  const isSegmentToday = targetDay === currentDay;
                  const isSegmentFuture = targetDay > currentDay;
                  const hasSub = currentUser
                    ? submissions.some(
                        (s) =>
                          s.participant_id === currentUser.id &&
                          s.challenge_day === targetDay
                      )
                    : false;

                  return (
                    <div
                      key={segmentIndex}
                      title={`Day ${targetDay}`}
                      className={`h-2.5 w-6 sm:w-8 rounded-sm transition-all ${
                        hasSub
                          ? "bg-neutral-950"
                          : isSegmentToday
                          ? "bg-amber-400/80 border border-amber-500/50"
                          : isSegmentFuture
                          ? "bg-neutral-100 border border-neutral-200/60"
                          : "bg-neutral-200"
                      }`}
                    />
                  );
                })}

                <div className="ml-2 w-5 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                  ) : isFuture ? (
                    <Lock className="w-3.5 h-3.5 text-neutral-300" />
                  ) : (
                    <span className="text-[11px] font-mono text-neutral-400">
                      {isToday ? "•" : "—"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
