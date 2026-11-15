"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Problem } from "@/types";
import { Plus, Check, ExternalLink, Code2 } from "lucide-react";

interface HabitActivityGridProps {
  onOpenSubmitModal: (problem: Problem) => void;
  onOpenDay50Modal: (problem: Problem) => void;
}

export const HabitActivityGrid: React.FC<HabitActivityGridProps> = ({
  onOpenSubmitModal,
  onOpenDay50Modal,
}) => {
  const { challengeInfo, problems, currentUser, submissions } = useApp();

  const currentDay = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;

  // Pick up to 5 relevant problems around the current day
  const startIdx = Math.max(0, currentDay - 3);
  const displayProblems = problems.slice(startIdx, startIdx + 5);
  const todayProblem = problems.find((p) => p.day_number === currentDay) || problems[0];

  const hasSubmittedToday = currentUser
    ? submissions.some(
        (s) => s.participant_id === currentUser.id && s.challenge_day === currentDay
      )
    : false;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Daily Focus
          </span>
          <h3 className="text-lg font-bold tracking-tight text-neutral-900 mt-0.5">
            Active Challenges
          </h3>
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          {challengeInfo.weekdayFormatted || "50 Days Habit"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayProblems.map((prob) => {
          const isToday = prob.day_number === currentDay;
          const userSub = currentUser
            ? submissions.find(
                (s) =>
                  s.participant_id === currentUser.id &&
                  s.challenge_day === prob.day_number
              )
            : null;
          const isCompleted = !!userSub;

          return (
            <div
              key={prob.id}
              className={`habit-card rounded-3xl p-4 flex flex-col justify-between min-h-[120px] transition-all relative border ${
                isToday
                  ? "border-neutral-950 bg-white ring-1 ring-neutral-900/10 shadow-sm"
                  : isCompleted
                  ? "border-neutral-200 bg-white"
                  : "border-neutral-100 bg-neutral-50/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-neutral-400">
                  D{prob.day_number}
                </span>
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-neutral-950 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                {isToday && !isCompleted && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Today
                  </span>
                )}
              </div>

              <div className="my-2">
                <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-tight">
                  {prob.title}
                </h4>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                  {prob.topic}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-[10px]">
                <a
                  href={prob.leetcode_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 font-medium"
                >
                  <span>LeetCode</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          );
        })}

        {/* 6th Card: The Black Rounded Action Card with + matching the design reference */}
        <button
          onClick={() => {
            if (currentDay === 50) {
              onOpenDay50Modal(todayProblem);
            } else {
              onOpenSubmitModal(todayProblem);
            }
          }}
          className="rounded-3xl bg-neutral-950 hover:bg-neutral-800 text-white p-4 flex flex-col items-center justify-center min-h-[120px] transition-all shadow-md hover:shadow-lg group"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 group-hover:bg-neutral-800 flex items-center justify-center mb-2 transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-center">
            {hasSubmittedToday ? "View Submission" : "Submit Progress"}
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5">
            Day {currentDay}
          </span>
        </button>
      </div>
    </div>
  );
};
