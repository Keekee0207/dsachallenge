"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Clock, Github, ExternalLink, Users } from "lucide-react";
import { formatIST } from "@/lib/challenge-dates";

export const CommunityActivity: React.FC = () => {
  const { todayParticipantsProgress, communityActivities, challengeInfo } = useApp();

  const completedCount = todayParticipantsProgress.filter((p) => p.hasCompletedToday).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* 1. Today's Progress across all 4 participants */}
      <div className="lg:col-span-1 habit-card rounded-3xl p-6 border border-neutral-200/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Community
              </span>
              <h3 className="text-lg font-bold tracking-tight text-neutral-900 mt-0.5">
                Today&apos;s Progress
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800">
              {completedCount}/4 Completed
            </span>
          </div>

          <p className="text-xs text-neutral-500 mb-5">
            Real-time accountability across all four challenge participants for Day{" "}
            {challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1}.
          </p>

          <div className="space-y-3">
            {todayParticipantsProgress.map(({ participant, hasCompletedToday, submissionTime, githubUrl }) => (
              <div
                key={participant.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  hasCompletedToday
                    ? "bg-white border-neutral-200 shadow-xs"
                    : "bg-neutral-50/60 border-neutral-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      hasCompletedToday
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {participant.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                      {participant.name}
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      {hasCompletedToday ? submissionTime : "Pending submission"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasCompletedToday ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        Completed
                      </span>
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View GitHub Solution"
                          className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Midnight deadline: 11:59 PM IST</span>
          <span className="font-mono">Asia/Kolkata</span>
        </div>
      </div>

      {/* 2. Community Live Feed */}
      <div className="lg:col-span-2 habit-card rounded-3xl p-6 border border-neutral-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Live Feed
            </span>
            <h3 className="text-lg font-bold tracking-tight text-neutral-900 mt-0.5">
              Recent Submissions
            </h3>
          </div>
          <Users className="w-4 h-4 text-neutral-400" />
        </div>

        {communityActivities.length === 0 ? (
          <div className="py-12 text-center text-neutral-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium text-neutral-600">
              No submissions yet. Be the first to solve and commit!
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Submissions from all four participants will appear here live.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {communityActivities.slice(0, 8).map((activity) => (
              <div
                key={activity.id}
                className="p-3.5 rounded-2xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
                    {activity.participant_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-neutral-900">
                      <span className="font-bold">{activity.participant_name}</span> completed{" "}
                      <span className="font-semibold text-neutral-800">
                        Day {activity.challenge_day}: {activity.problem_title}
                      </span>
                    </p>
                    <span className="text-[10px] text-neutral-400">
                      {formatIST(activity.submitted_at)}
                    </span>
                  </div>
                </div>

                <a
                  href={activity.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 text-[11px] font-semibold text-neutral-800 transition-all shadow-xs flex-shrink-0"
                >
                  <Github className="w-3 h-3" />
                  <span className="hidden sm:inline">Code</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
