"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Problem } from "@/types";
import { X, Github, ExternalLink, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface SubmitModalProps {
  problem: Problem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  problem,
  isOpen,
  onClose,
}) => {
  const { submitSolution, currentUser, challengeInfo } = useApp();

  const [solvedPreviously, setSolvedPreviously] = useState<boolean>(false);
  const [alternativeName, setAlternativeName] = useState("");
  const [alternativeUrl, setAlternativeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !problem) return null;

  const currentChallengeDay = problem.day_number;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!githubUrl.trim()) {
      setErrorMessage("Please enter your GitHub solution link.");
      return;
    }

    const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i;
    if (!githubRegex.test(githubUrl.trim())) {
      setErrorMessage(
        "Invalid GitHub URL. Must be in format: https://github.com/username/repository/..."
      );
      return;
    }

    if (solvedPreviously) {
      if (!alternativeName.trim()) {
        setErrorMessage("Please specify the alternative DSA problem title.");
        return;
      }
      if (!alternativeUrl.trim()) {
        setErrorMessage("Please provide the alternative problem URL.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await submitSolution({
        challengeDay: currentChallengeDay,
        assignedProblemId: problem.id,
        solvedPreviously,
        alternativeProblemName: solvedPreviously ? alternativeName.trim() : undefined,
        alternativeProblemUrl: solvedPreviously ? alternativeUrl.trim() : undefined,
        githubUrl: githubUrl.trim(),
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Submission failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Celebrate success!
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#18181B", "#71717A", "#10B981", "#F59E0B"],
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset state
        setGithubUrl("");
        setNotes("");
        setAlternativeName("");
        setAlternativeUrl("");
        setSolvedPreviously(false);
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-elevated border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-neutral-950 text-white mx-auto flex items-center justify-center mb-4 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1">
              Day {currentChallengeDay} Logged!
            </h3>
            <p className="text-sm text-neutral-500 max-w-xs mx-auto">
              Your solution has been recorded and your streak updated. Keep the momentum alive.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white font-mono text-[11px] font-bold">
                  Day {currentChallengeDay} of 50
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium">
                  {problem.difficulty}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Submit Today&apos;s Solution
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Upload your code to GitHub and share the link for peer accountability.
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Assigned Problem */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Field 1 — Assigned Problem
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{problem.title}</h4>
                    <span className="text-xs text-neutral-500">{problem.topic}</span>
                  </div>
                  <a
                    href={problem.leetcode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Field 2: Solved Previously? */}
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-2">
                  Field 2 — Have you already solved this problem before?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSolvedPreviously(false)}
                    className={`p-3 rounded-2xl text-left border text-xs font-medium transition-all ${
                      !solvedPreviously
                        ? "border-neutral-950 bg-neutral-950 text-white shadow-xs"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    No, first time solving it
                  </button>
                  <button
                    type="button"
                    onClick={() => setSolvedPreviously(true)}
                    className={`p-3 rounded-2xl text-left border text-xs font-medium transition-all ${
                      solvedPreviously
                        ? "border-neutral-950 bg-neutral-950 text-white shadow-xs"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Yes, solved previously
                  </button>
                </div>

                {/* Sub-fields if solved previously */}
                {solvedPreviously && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3 animate-in fade-in duration-150">
                    <p className="text-[11px] text-amber-900 font-medium">
                      Because you have already solved this problem before, please solve a new,
                      equivalent DSA problem of similar difficulty.
                    </p>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-800 block mb-1">
                        Alternative Problem Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3Sum Closest"
                        value={alternativeName}
                        onChange={(e) => setAlternativeName(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                        required={solvedPreviously}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-800 block mb-1">
                        Alternative LeetCode Problem URL *
                      </label>
                      <input
                        type="url"
                        placeholder="https://leetcode.com/problems/..."
                        value={alternativeUrl}
                        onChange={(e) => setAlternativeUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                        required={solvedPreviously}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Field 3: GitHub Solution Link */}
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Field 3 — Paste your GitHub solution link *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo/blob/main/day-1.py"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full text-xs pl-10 pr-3 py-2.5 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white font-mono"
                    required
                  />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Direct URL to your solution code file or commit on GitHub.
                </span>
              </div>

              {/* Field 4: Optional Notes */}
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Field 4 — Approach & Learnings (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention your time/space complexity, intuition, or edge cases handled..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Recording Progress..." : "Submit Today's Progress"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
