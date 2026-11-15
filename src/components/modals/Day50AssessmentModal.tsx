"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Problem } from "@/types";
import { X, CheckCircle2, AlertCircle, Award, Github, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface Day50AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
}

export const Day50AssessmentModal: React.FC<Day50AssessmentModalProps> = ({
  isOpen,
  onClose,
  problem,
}) => {
  const { submitSolution, problems } = useApp();

  // Filter previous problems by category
  const arrayProblems = problems.filter((p) => p.week_number <= 2 && p.day_number < 50);
  const listOrStackProblems = problems.filter(
    (p) => (p.week_number === 3 || p.week_number === 4) && p.day_number < 50
  );
  const treeOrGraphProblems = problems.filter(
    (p) => (p.week_number === 5 || p.week_number === 6 || p.week_number === 7) && p.day_number < 50
  );

  // Form State
  const [arrayProblemName, setArrayProblemName] = useState(arrayProblems[0]?.title || "");
  const [arrayGithub, setArrayGithub] = useState("");

  const [listProblemName, setListProblemName] = useState(listOrStackProblems[0]?.title || "");
  const [listGithub, setListGithub] = useState("");

  const [treeProblemName, setTreeProblemName] = useState(treeOrGraphProblems[0]?.title || "");
  const [treeGithub, setTreeGithub] = useState("");

  const [approachExplanation, setApproachExplanation] = useState("");
  const [reflections, setReflections] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i;

    if (!githubRegex.test(arrayGithub.trim())) {
      setErrorMessage("Please enter a valid GitHub link for the Array problem.");
      return;
    }
    if (!githubRegex.test(listGithub.trim())) {
      setErrorMessage("Please enter a valid GitHub link for the Linked List / Stack problem.");
      return;
    }
    if (!githubRegex.test(treeGithub.trim())) {
      setErrorMessage("Please enter a valid GitHub link for the Tree / Graph problem.");
      return;
    }
    if (!approachExplanation.trim()) {
      setErrorMessage("Please provide your approach and time/space complexity explanation.");
      return;
    }
    if (!reflections.trim()) {
      setErrorMessage("Please share your 50-day learning reflection.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitSolution({
        challengeDay: 50,
        assignedProblemId: problem.id,
        solvedPreviously: false,
        githubUrl: arrayGithub.trim(),
        notes: `Day 50 Capstone Assessment:\n1. Array: ${arrayProblemName} (${arrayGithub})\n2. List/Stack: ${listProblemName} (${listGithub})\n3. Tree/Graph: ${treeProblemName} (${treeGithub})\n\nApproach:\n${approachExplanation}\n\n50-Day Reflection:\n${reflections}`,
        isDay50Assessment: true,
        day50Data: {
          array_problem_name: arrayProblemName,
          array_github_url: arrayGithub.trim(),
          linked_or_stack_problem_name: listProblemName,
          linked_or_stack_github_url: listGithub.trim(),
          tree_or_graph_problem_name: treeProblemName,
          tree_or_graph_github_url: treeGithub.trim(),
          approach_explanation: approachExplanation.trim(),
          reflections_and_learnings: reflections.trim(),
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Submission failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#18181B", "#F59E0B", "#10B981", "#3B82F6", "#EC4899"],
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-elevated border border-neutral-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-neutral-950 text-amber-400 mx-auto flex items-center justify-center mb-5 shadow-lg">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">
              🎉 50 Days Challenge Completed!
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Incredible achievement! You have demonstrated relentless discipline, solving DSA
              problems for 50 consecutive calendar days. Wear this consistency with pride!
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-neutral-950 text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Day 50 Capstone Assessment
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                Final Assessment &amp; 50-Day Synthesis
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
                To complete Day 50, select and solve three problems across three core domains, explain
                your complexity, and share your personal reflection.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Part 1: Array Problem */}
              <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Problem 1: Array Problem
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-medium">Domain: Arrays</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Select Array Problem
                  </label>
                  <select
                    value={arrayProblemName}
                    onChange={(e) => setArrayProblemName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    {arrayProblems.map((p) => (
                      <option key={p.id} value={p.title}>
                        Day {p.day_number}: {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GitHub Solution URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={arrayGithub}
                    onChange={(e) => setArrayGithub(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Part 2: Linked List or Stack Problem */}
              <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Problem 2: Linked List or Stack
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-medium">Domain: Pointers / LIFO</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Select Problem
                  </label>
                  <select
                    value={listProblemName}
                    onChange={(e) => setListProblemName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    {listOrStackProblems.map((p) => (
                      <option key={p.id} value={p.title}>
                        Day {p.day_number}: {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GitHub Solution URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={listGithub}
                    onChange={(e) => setListGithub(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Part 3: Tree or Graph Problem */}
              <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Problem 3: Tree or Graph
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-medium">Domain: Trees / Graphs</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Select Problem
                  </label>
                  <select
                    value={treeProblemName}
                    onChange={(e) => setTreeProblemName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    {treeOrGraphProblems.map((p) => (
                      <option key={p.id} value={p.title}>
                        Day {p.day_number}: {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    GitHub Solution URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={treeGithub}
                    onChange={(e) => setTreeGithub(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 bg-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Approach & Complexity */}
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Explain Approach &amp; Time/Space Complexity *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail your algorithmic approach, trade-offs, and Big-O complexities for the three chosen problems..."
                  value={approachExplanation}
                  onChange={(e) => setApproachExplanation(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-neutral-300 bg-white"
                  required
                />
              </div>

              {/* 50-Day Learnings & Reflection */}
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  What did you learn during the 50 days? *
                </label>
                <textarea
                  rows={3}
                  placeholder="Reflect on your consistency, problem-solving mindset shift, debugging habits, and future roadmap..."
                  value={reflections}
                  onChange={(e) => setReflections(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-neutral-300 bg-white"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Finalizing Capstone..." : "Submit Day 50 Capstone Assessment"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
