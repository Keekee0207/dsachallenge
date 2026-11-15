"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Problem, Submission } from "@/types";
import {
  getDateForChallengeDay,
  formatISTDateOnly,
  formatIST,
  getDeadlineForChallengeDay,
} from "@/lib/challenge-dates";
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ExternalLink,
  Github,
  Lock,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";

export const CalendarView: React.FC = () => {
  const { challengeInfo, problems, currentUser, submissions } = useApp();

  const currentDay = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(currentDay);

  // Selected problem
  const selectedProblem =
    problems.find((p) => p.day_number === selectedDayNumber) || problems[0];
  const selectedDate = getDateForChallengeDay(selectedDayNumber);
  const selectedDeadline = getDeadlineForChallengeDay(selectedDayNumber);

  // User submission for selected day
  const selectedUserSubmission = currentUser
    ? submissions.find(
        (s) =>
          s.participant_id === currentUser.id &&
          s.challenge_day === selectedDayNumber
      )
    : null;

  // Determine status color helper
  const getDayStatus = (dayNum: number) => {
    const isCompleted = currentUser
      ? submissions.some(
          (s) => s.participant_id === currentUser.id && s.challenge_day === dayNum
        )
      : false;

    if (isCompleted) return "completed";
    if (dayNum === currentDay) return "today";
    if (dayNum < currentDay) return "missed";
    return "upcoming";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-neutral-300" />
            <span>CALENDAR &amp; HEATMAP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            50-Day Consistency Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Nov 21, 2026 – Jan 9, 2027. Track daily completion, missed milestones, and streaks.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-3 rounded-2xl border border-neutral-100 shadow-subtle">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm bg-neutral-950" />
            <span className="text-neutral-700 font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm bg-amber-400 border border-amber-500/50" />
            <span className="text-neutral-700 font-medium">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm bg-rose-200 border border-rose-300" />
            <span className="text-neutral-700 font-medium">Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm bg-neutral-100 border border-neutral-200/80" />
            <span className="text-neutral-400 font-medium">Upcoming</span>
          </div>
        </div>
      </div>

      {/* 50-Day Contribution Heatmap Grid */}
      <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            All 50 Days Matrix
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            Click any cell to view day details
          </span>
        </div>

        {/* 50 cells grid: 10 columns on desktop, 5 columns on tablet, 5 on mobile */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
          {problems.map((prob) => {
            const status = getDayStatus(prob.day_number);
            const isSelected = selectedDayNumber === prob.day_number;

            return (
              <button
                key={prob.id}
                onClick={() => setSelectedDayNumber(prob.day_number)}
                className={`aspect-square rounded-2xl p-2 flex flex-col justify-between transition-all text-left relative ${
                  isSelected ? "ring-2 ring-neutral-900 ring-offset-2 scale-105 z-10" : ""
                } ${
                  status === "completed"
                    ? "bg-neutral-950 text-white shadow-xs"
                    : status === "today"
                    ? "bg-amber-100 border-2 border-amber-500 text-amber-950"
                    : status === "missed"
                    ? "bg-rose-50 border border-rose-200 text-rose-800"
                    : "bg-neutral-50/80 border border-neutral-200/70 text-neutral-400 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold font-mono">
                    {prob.day_number}
                  </span>
                  {status === "completed" && (
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  )}
                  {status === "today" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {status === "upcoming" && (
                    <Lock className="w-2.5 h-2.5 text-neutral-300" />
                  )}
                </div>

                <div className="text-[9px] font-medium truncate w-full opacity-80">
                  {formatISTDateOnly(getDateForChallengeDay(prob.day_number)).split(",")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail Card — Inspired by Reference Screen 4 */}
      <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-neutral-950 text-white font-mono text-xs font-bold">
                Day {selectedDayNumber} of 50
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-medium">
                Week {selectedProblem.week_number} • {selectedProblem.difficulty}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                {selectedProblem.topic}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
              {selectedProblem.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Assigned Date: {formatISTDateOnly(selectedDate)} • Deadline: 11:59 PM IST
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={selectedProblem.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-300 bg-white text-xs font-semibold text-neutral-800 transition-all hover:bg-neutral-50"
            >
              <span>LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>
        </div>

        {/* Problem Description */}
        <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
          {selectedProblem.description}
        </p>

        {/* Submission History / Details */}
        <div className="border border-neutral-200/80 rounded-2xl p-5 bg-neutral-50/50">
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
            Submission Status
          </h4>

          {selectedUserSubmission ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Successfully Submitted &amp; Verified
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {formatIST(selectedUserSubmission.submitted_at)}
                </span>
              </div>

              {selectedUserSubmission.solved_previously && (
                <div className="text-xs text-neutral-700 bg-white p-3 rounded-xl border border-neutral-200">
                  <p>
                    <strong>Alternative Problem:</strong>{" "}
                    {selectedUserSubmission.alternative_problem_name}
                  </p>
                  {selectedUserSubmission.alternative_problem_url && (
                    <a
                      href={selectedUserSubmission.alternative_problem_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-neutral-900 underline text-[11px] mt-1 inline-block"
                    >
                      {selectedUserSubmission.alternative_problem_url}
                    </a>
                  )}
                </div>
              )}

              <div className="pt-2">
                <a
                  href={selectedUserSubmission.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold transition-all shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Open GitHub Solution Repository</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>

              {selectedUserSubmission.notes && (
                <div className="pt-2 text-xs text-neutral-600">
                  <span className="font-semibold text-neutral-900">Notes &amp; Learnings: </span>
                  {selectedUserSubmission.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-neutral-500">
              {selectedDayNumber === currentDay ? (
                <div className="flex items-center gap-2 text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>
                    Today is Day {selectedDayNumber}. Complete and submit before 11:59 PM IST to
                    maintain your streak!
                  </span>
                </div>
              ) : selectedDayNumber < currentDay ? (
                <div className="flex items-center gap-2 text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>
                    No submission was recorded for Day {selectedDayNumber}. This day is marked as
                    missed.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-500 bg-neutral-100 p-3 rounded-xl">
                  <Lock className="w-4 h-4 text-neutral-400" />
                  <span>
                    Day {selectedDayNumber} will unlock on{" "}
                    {formatISTDateOnly(getDateForChallengeDay(selectedDayNumber))}.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
