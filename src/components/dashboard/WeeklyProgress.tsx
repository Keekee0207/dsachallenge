"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Problem, Submission } from "@/types";
import { WEEK_OBJECTIVES } from "@/data/problems";
import {
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
  ChevronRight,
  Github,
  X,
} from "lucide-react";
import { formatISTDateOnly, formatIST } from "@/lib/challenge-dates";

export const WeeklyProgress: React.FC = () => {
  const { challengeInfo, problems, currentUser, submissions } = useApp();

  const currentDay = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;
  // Calculate current week (1 to 8, week 1 is days 1-7, etc.)
  const currentWeekNumber = Math.min(8, Math.max(1, Math.ceil(currentDay / 7)));

  // Selected week view (defaults to current week)
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeekNumber);
  // Selected problem to view detail modal
  const [inspectProblem, setInspectProblem] = useState<Problem | null>(null);

  // Filter problems for selected week
  const weekProblems = problems.filter((p) => p.week_number === selectedWeek);
  const weekInfo = WEEK_OBJECTIVES[selectedWeek] || {
    title: `Week ${selectedWeek}`,
    objective: "Master core problem solving patterns and data structures.",
    concepts: [],
  };

  // Inspect problem submission for current user
  const userSubmissionForInspected = inspectProblem && currentUser
    ? submissions.find(
        (s) =>
          s.participant_id === currentUser.id &&
          s.challenge_day === inspectProblem.day_number
      )
    : null;

  return (
    <div className="habit-card rounded-3xl p-6 sm:p-7 mb-8 border border-neutral-200/80">
      {/* Header with Week selector tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Weekly Progress
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 font-semibold text-neutral-700">
              Week {selectedWeek} of 7
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
            {weekInfo.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            {weekInfo.objective}
          </p>
        </div>

        {/* Minimal Week Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[1, 2, 3, 4, 5, 6, 7].map((wk) => (
            <button
              key={wk}
              onClick={() => setSelectedWeek(wk)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                selectedWeek === wk
                  ? "bg-neutral-900 text-white shadow-xs"
                  : wk === currentWeekNumber
                  ? "bg-neutral-100 text-neutral-900 border border-neutral-300"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
              }`}
            >
              W{wk}
            </button>
          ))}
        </div>
      </div>

      {/* Week Problem Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {weekProblems.map((prob) => {
          const isToday = prob.day_number === currentDay;
          const isPast = prob.day_number < currentDay;
          const isFuture = prob.day_number > currentDay;

          // Check if current user completed this day
          const userSub = currentUser
            ? submissions.find(
                (s) =>
                  s.participant_id === currentUser.id &&
                  s.challenge_day === prob.day_number
              )
            : null;

          const isCompleted = !!userSub;
          const isMissed = isPast && !isCompleted;

          return (
            <div
              key={prob.id}
              onClick={() => {
                if (!isFuture || prob.day_number === currentDay) {
                  setInspectProblem(prob);
                }
              }}
              className={`rounded-2xl p-3.5 transition-all flex flex-col justify-between border relative ${
                isToday
                  ? "border-neutral-900 bg-white ring-2 ring-neutral-900/10 cursor-pointer shadow-sm"
                  : isFuture
                  ? "border-neutral-100 bg-neutral-50/50 opacity-60 cursor-not-allowed"
                  : isCompleted
                  ? "border-neutral-200 bg-white hover:border-neutral-300 cursor-pointer hover:shadow-xs"
                  : isMissed
                  ? "border-rose-100 bg-rose-50/20 cursor-pointer"
                  : "border-neutral-200 bg-white cursor-pointer"
              }`}
            >
              {/* Day Number and Status Icon */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-900 font-mono">
                  D{prob.day_number}
                </span>

                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                ) : isFuture ? (
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                ) : isToday ? (
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                ) : isMissed ? (
                  <span className="text-[10px] font-semibold text-rose-500 uppercase">
                    Missed
                  </span>
                ) : (
                  <Clock className="w-3.5 h-3.5 text-neutral-300" />
                )}
              </div>

              {/* Problem Title */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-neutral-800 line-clamp-2 leading-snug">
                  {prob.title}
                </p>
                <span className="text-[10px] text-neutral-400 mt-1 block truncate">
                  {prob.topic}
                </span>
              </div>

              {/* Footer status text */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                <span
                  className={`font-medium ${
                    isCompleted
                      ? "text-emerald-700"
                      : isToday
                      ? "text-neutral-900 font-semibold"
                      : isMissed
                      ? "text-rose-600"
                      : "text-neutral-400"
                  }`}
                >
                  {isCompleted
                    ? "Completed"
                    : isToday
                    ? "Today"
                    : isMissed
                    ? "Unsolved"
                    : "Locked"}
                </span>

                {(!isFuture || isToday) && (
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Problem Inspection Modal / Drawer */}
      {inspectProblem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-elevated border border-neutral-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-neutral-900 text-white font-bold text-xs font-mono">
                  Day {inspectProblem.day_number}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium">
                  {inspectProblem.difficulty}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {inspectProblem.topic}
                </span>
              </div>
              <button
                onClick={() => setInspectProblem(null)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {inspectProblem.title}
            </h3>

            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              {inspectProblem.description}
            </p>

            {/* Submission Status Section */}
            {userSubmissionForInspected ? (
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Submitted & Verified
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {formatIST(userSubmissionForInspected.submitted_at)}
                  </span>
                </div>

                <div className="mt-3">
                  <a
                    href={userSubmissionForInspected.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 hover:underline"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View GitHub Solution</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>

                {userSubmissionForInspected.notes && (
                  <p className="text-xs text-neutral-600 mt-2 pt-2 border-t border-neutral-200/60">
                    <strong className="text-neutral-900">Notes:</strong>{" "}
                    {userSubmissionForInspected.notes}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-2xl p-4 mb-6 text-xs text-neutral-500">
                {inspectProblem.day_number === currentDay
                  ? "This is today's active challenge. Complete your solution on LeetCode and submit your GitHub link before 11:59 PM IST!"
                  : inspectProblem.day_number < currentDay
                  ? "This problem was not submitted on its assigned day."
                  : "This challenge will unlock on its scheduled date."}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <a
                href={inspectProblem.leetcode_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-800 transition-all hover:bg-neutral-50"
              >
                <span>Open LeetCode</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
              <button
                onClick={() => setInspectProblem(null)}
                className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
