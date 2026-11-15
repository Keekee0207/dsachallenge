"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Problem, Submission } from "@/types";
import {
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Github,
  BookOpen,
  Code2,
  Sparkles,
} from "lucide-react";
import { formatIST, formatISTDateOnly } from "@/lib/challenge-dates";

interface TodayChallengeCardProps {
  onOpenSubmitModal: (problem: Problem) => void;
  onOpenDay50Modal: (problem: Problem) => void;
}

export const TodayChallengeCard: React.FC<TodayChallengeCardProps> = ({
  onOpenSubmitModal,
  onOpenDay50Modal,
}) => {
  const { challengeInfo, problems, currentUser, submissions, simulatedDate } = useApp();

  // Find today's problem
  const todayDayNumber = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;
  const todayProblem = problems.find((p) => p.day_number === todayDayNumber) || problems[0];

  // Find user's submission for today
  const userTodaySubmission: Submission | undefined = currentUser
    ? submissions.find(
        (s) => s.participant_id === currentUser.id && s.challenge_day === todayDayNumber
      )
    : undefined;

  // Real-time countdown clock state for upcoming challenge
  const [countdown, setCountdown] = useState({
    days: challengeInfo.daysUntilStart,
    hours: challengeInfo.hoursUntilStart,
    minutes: challengeInfo.minutesUntilStart,
    seconds: challengeInfo.secondsUntilStart,
  });

  useEffect(() => {
    if (!challengeInfo.isUpcoming) return;

    const timer = setInterval(() => {
      const now = simulatedDate ? new Date(simulatedDate).getTime() : Date.now();
      const startMs = new Date("2026-11-21T00:00:00+05:30").getTime();
      const diffMs = startMs - now;

      if (diffMs <= 0) {
        clearInterval(timer);
      } else {
        const msPerDay = 24 * 60 * 60 * 1000;
        setCountdown({
          days: Math.floor(diffMs / msPerDay),
          hours: Math.floor((diffMs % msPerDay) / (60 * 60 * 1000)),
          minutes: Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000)),
          seconds: Math.floor((diffMs % (60 * 1000)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeInfo.isUpcoming, simulatedDate]);

  // Difficulty badge colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "Medium":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Hard":
        return "bg-rose-50 text-rose-800 border-rose-200/80";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  // If challenge is upcoming (before Nov 20, 2026)
  if (challengeInfo.isUpcoming) {
    return (
      <div className="habit-card rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 border border-neutral-200/70 bg-gradient-to-b from-white to-neutral-50/50">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium mb-4">
            <Clock className="w-3.5 h-3.5 text-neutral-300" />
            <span>Upcoming Challenge — Starts Nov 21, 2026 (IST)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            The 50 Days DSA Challenge is almost here.
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 mb-6 font-normal leading-relaxed">
            Four participants. Fifty consecutive days. Zero excuses. Master DSA fundamentals,
            algorithms, and data structures with daily commits to your GitHub repository.
          </p>

          {/* Minimal Countdown Tiles */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-md">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="bg-white border border-neutral-200/80 rounded-2xl p-3 sm:p-4 text-center shadow-xs"
              >
                <div className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-mono">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-medium mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Day 1 Preview */}
          <div className="border border-neutral-200/70 bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Day 1 Preview (Kickoff Problem)
              </span>
              <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                {todayProblem.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">{todayProblem.topic}</p>
            </div>

            <a
              href={todayProblem.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-800 transition-all hover:bg-neutral-50"
            >
              <span>Preview LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Active or Ended Challenge View
  return (
    <div className="habit-card rounded-3xl p-6 sm:p-8 lg:p-9 mb-8 border border-neutral-200/80 relative overflow-hidden">
      {/* Background subtle watermark for Day number */}
      <div className="absolute right-4 top-2 text-[120px] font-black text-neutral-50/70 select-none pointer-events-none -z-0 leading-none">
        {todayDayNumber}
      </div>

      <div className="relative z-10">
        {/* Top Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-neutral-900 text-white font-semibold text-xs tracking-tight">
              Day {todayDayNumber} of 50
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(
                todayProblem.difficulty
              )}`}
            >
              {todayProblem.difficulty}
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">•</span>
            <span className="text-xs font-medium text-neutral-500 hidden sm:inline">
              {todayProblem.topic}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{challengeInfo.todayDateFormatted}</span>
          </div>
        </div>

        {/* Problem Title & Description */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            {todayProblem.title}
          </h2>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
            {todayProblem.description}
          </p>
        </div>

        {/* Status & Action Area */}
        {userTodaySubmission ? (
          // Completed State Card
          <div className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-900">
                      Completed Today
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Submitted at {formatIST(userTodaySubmission.submitted_at)}
                  </p>
                  {userTodaySubmission.solved_previously && (
                    <p className="text-xs text-neutral-600 mt-1">
                      <span className="font-medium">Alternative Problem Solved:</span>{" "}
                      {userTodaySubmission.alternative_problem_name}
                    </p>
                  )}
                </div>
              </div>

              {/* View GitHub Link Button */}
              <div className="flex items-center gap-2">
                <a
                  href={userTodaySubmission.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-800 transition-all shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View GitHub Solution</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>
            </div>

            {/* Optional Notes snippet if present */}
            {userTodaySubmission.notes && (
              <div className="mt-3 pt-3 border-t border-neutral-200/60 text-xs text-neutral-600">
                <span className="font-medium text-neutral-900">Notes & Reflection: </span>
                {userTodaySubmission.notes}
              </div>
            )}
          </div>
        ) : (
          // Pending Submission Action Bar
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {/* Solve Problem on LeetCode */}
            <a
              href={todayProblem.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900 transition-all shadow-xs"
            >
              <Code2 className="w-4 h-4 text-neutral-700" />
              <span>Solve Problem on LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>

            {/* Submit Solution Button */}
            <button
              onClick={() => {
                if (todayDayNumber === 50) {
                  onOpenDay50Modal(todayProblem);
                } else {
                  onOpenSubmitModal(todayProblem);
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Github className="w-4 h-4" />
              <span>
                {todayDayNumber === 50
                  ? "Submit Day 50 Capstone Assessment"
                  : "Submit Today's Solution"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
