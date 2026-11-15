"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { WEEK_OBJECTIVES } from "@/data/problems";
import { getDateForChallengeDay, formatISTDateOnly } from "@/lib/challenge-dates";
import {
  ListTodo,
  ExternalLink,
  CheckCircle2,
  Lock,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export const RoadmapView: React.FC = () => {
  const { problems, challengeInfo, currentUser, submissions } = useApp();

  const currentDay = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;
  const [openWeek, setOpenWeek] = useState<number>(
    Math.min(8, Math.max(1, Math.ceil(currentDay / 7)))
  );

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

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold mb-2">
          <ListTodo className="w-3.5 h-3.5 text-neutral-300" />
          <span>CURRICULUM ROADMAP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          50 Days DSA Syllabus
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Structured progression from basic logic and recursion to heaps, graphs, and the Day 50
          capstone assessment.
        </p>
      </div>

      {/* Week Accordions */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((wk) => {
          const weekMeta = WEEK_OBJECTIVES[wk];
          const weekProbs = problems.filter((p) => p.week_number === wk);
          const isOpen = openWeek === wk;

          const completedInWeek = weekProbs.filter((prob) =>
            currentUser
              ? submissions.some(
                  (s) =>
                    s.participant_id === currentUser.id &&
                    s.challenge_day === prob.day_number
                )
              : false
          ).length;

          return (
            <div
              key={wk}
              className="habit-card rounded-3xl border border-neutral-200/80 overflow-hidden transition-all"
            >
              {/* Week Accordion Header */}
              <button
                onClick={() => setOpenWeek(isOpen ? 0 : wk)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-xs font-mono">
                    W{wk}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Week {wk}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium">
                        {completedInWeek}/{weekProbs.length} Completed
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                      {weekMeta?.title || `Week ${wk}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Week Content */}
              {isOpen && (
                <div className="p-5 sm:p-6 pt-0 border-t border-neutral-100">
                  <p className="text-xs sm:text-sm text-neutral-600 mb-4 font-normal">
                    {weekMeta?.objective}
                  </p>

                  {/* Concepts checklist */}
                  {weekMeta?.concepts && weekMeta.concepts.length > 0 && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                        Concepts to master:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {weekMeta.concepts.map((concept, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-2 text-xs text-neutral-700"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                            <span>{concept}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Problem List */}
                  <div className="space-y-2.5">
                    {weekProbs.map((problem) => {
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
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isCompleted
                              ? "bg-white border-neutral-200"
                              : isToday
                              ? "bg-white border-neutral-900 ring-1 ring-neutral-900/10 shadow-xs"
                              : "bg-neutral-50/60 border-neutral-100"
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <span className="font-mono text-xs font-bold text-neutral-900 w-12 flex-shrink-0">
                              Day {problem.day_number}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                                  {problem.title}
                                </h4>
                                <span
                                  className={`text-[10px] px-2 py-0.2 rounded-full border font-medium ${getDifficultyColor(
                                    problem.difficulty
                                  )}`}
                                >
                                  {problem.difficulty}
                                </span>
                              </div>
                              <span className="text-[11px] text-neutral-400">
                                {formatISTDateOnly(getDateForChallengeDay(problem.day_number))} •{" "}
                                {problem.topic}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-auto">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Completed
                              </span>
                            ) : isToday ? (
                              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                Today&apos;s Challenge
                              </span>
                            ) : isFuture ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                                <Lock className="w-3 h-3 text-neutral-400" />
                                Locked
                              </span>
                            ) : (
                              <span className="text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                                Missed
                              </span>
                            )}

                            <a
                              href={problem.leetcode_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                              title="Solve on LeetCode"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
