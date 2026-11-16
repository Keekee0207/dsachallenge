"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Problem, Submission, Role } from "@/types";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Github,
  Flag,
  Edit2,
  Trash2,
  Plus,
  Search,
  Check,
  AlertCircle,
} from "lucide-react";
import { formatIST, formatISTDateOnly, getDateForChallengeDay } from "@/lib/challenge-dates";

export const AdminDashboard: React.FC = () => {
  const {
    currentRole,
    currentUser,
    participantStats,
    submissions,
    problems,
    allowedEmails,
    challengeInfo,
    verifySubmission,
    updateProblem,
    addAllowedEmail,
    updateAllowedEmail,
    deleteAllowedEmail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "submissions" | "allowlist" | "problems">("overview");

  // Allowlist Form State
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("participant");
  const [allowlistMsg, setAllowlistMsg] = useState<string | null>(null);
  const [editingAllowlistId, setEditingAllowlistId] = useState<string | null>(null);
  const [editAllowlistName, setEditAllowlistName] = useState("");
  const [editAllowlistEmail, setEditAllowlistEmail] = useState("");
  const [editAllowlistRole, setEditAllowlistRole] = useState<Role>("participant");

  // Problem Edit State
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // Submissions search & filter
  const [searchTerm, setSearchTerm] = useState("");

  if (currentRole !== "admin") {
    return (
      <div className="habit-card rounded-3xl p-10 text-center max-w-md mx-auto my-12 border border-neutral-200">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-neutral-900 mb-1">Admin Access Required</h2>
        <p className="text-xs text-neutral-500 mb-4">
          This area is restricted to the challenge organizer.
        </p>
      </div>
    );
  }

  // Metrics
  const currentDay = challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1;
  const activeParticipantsCount = allowedEmails.filter((a) => a.role === "participant" && a.is_active).length || 1;
  const totalSubmissions = submissions.length;
  const completedToday = submissions.filter((s) => s.challenge_day === currentDay).length;
  const pendingToday = Math.max(0, activeParticipantsCount - completedToday);
  const overallCompletedSum = participantStats.reduce((sum, p) => sum + p.completed_count, 0);
  const overallMaxPossible = 50 * activeParticipantsCount;
  const overallPercentage = overallMaxPossible > 0 ? Math.round((overallCompletedSum / overallMaxPossible) * 100) : 0;

  // CSV Export Function
  const handleExportCSV = () => {
    const headers = [
      "Submission ID",
      "Challenge Day",
      "Assigned Problem",
      "Participant Name",
      "Solved Previously",
      "Alternative Problem",
      "Alternative URL",
      "GitHub URL",
      "Submitted At (IST)",
      "Status",
      "Notes",
    ];

    const rows = submissions.map((s) => [
      s.id,
      s.challenge_day,
      `"${s.assigned_problem_title?.replace(/"/g, '""') || ""}"`,
      `"${s.participant_name || ""}"`,
      s.solved_previously ? "Yes" : "No",
      `"${s.alternative_problem_name?.replace(/"/g, '""') || ""}"`,
      s.alternative_problem_url || "",
      s.github_url,
      formatIST(s.submitted_at),
      s.verification_status,
      `"${s.notes?.replace(/"/g, '""') || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `50_days_dsa_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllowlistMsg(null);
    if (!newEmail.trim() || !newName.trim()) return;

    const ok = await addAllowedEmail(newEmail.trim(), newName.trim(), newRole);
    if (ok) {
      setNewEmail("");
      setNewName("");
      setAllowlistMsg("Added successfully.");
    } else {
      setAllowlistMsg("Email is already on the allowlist.");
    }
  };

  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    await updateProblem(editingProblem.id, {
      title: editTitle.trim(),
      topic: editTopic.trim(),
      leetcode_url: editUrl.trim(),
    });

    setEditingProblem(null);
  };

  const filteredSubmissions = submissions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.participant_name?.toLowerCase().includes(term) ||
      s.assigned_problem_title?.toLowerCase().includes(term) ||
      s.github_url.toLowerCase().includes(term) ||
      String(s.challenge_day).includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-neutral-300" />
            <span>ORGANIZER CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage participants, verify code submissions, audit logs, and configure problem roadmaps.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export All Submissions (CSV)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview & Participants" },
          { id: "submissions", label: `Submissions (${submissions.length})` },
          { id: "allowlist", label: `Participant Allowlist (${allowedEmails.length})` },
          { id: "problems", label: `Roadmap Problems (${problems.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="habit-card rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Registered Participants
              </span>
              <span className="text-2xl font-bold text-neutral-900">4</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">Private cohort</span>
            </div>

            <div className="habit-card rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Today Completed
              </span>
              <span className="text-2xl font-bold text-neutral-900">{completedToday}</span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">Day {currentDay}</span>
            </div>

            <div className="habit-card rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Today Pending
              </span>
              <span className="text-2xl font-bold text-neutral-900">{pendingToday}</span>
              <span className="text-[11px] text-amber-600 block mt-0.5">Until 11:59 PM IST</span>
            </div>

            <div className="habit-card rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Total Submissions
              </span>
              <span className="text-2xl font-bold text-neutral-900">{totalSubmissions}</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">Across all 50 days</span>
            </div>

            <div className="habit-card rounded-2xl p-4 sm:p-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Cohort Completion
              </span>
              <span className="text-2xl font-bold text-neutral-900">{overallPercentage}%</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">{overallCompletedSum}/200 solved</span>
            </div>
          </div>

          {/* Participant Management Table */}
          <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
            <h3 className="text-base font-bold text-neutral-900 mb-4">
              Participant Performance &amp; Allowlist Status
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Participant</th>
                    <th className="py-3 px-3">Email (Admin View)</th>
                    <th className="py-3 px-3 text-center">Completed</th>
                    <th className="py-3 px-3 text-center">Streak</th>
                    <th className="py-3 px-3 text-center">Best Streak</th>
                    <th className="py-3 px-3 text-center">Missed</th>
                    <th className="py-3 px-3 text-right">Completion %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {participantStats.map((p) => (
                    <tr key={p.participant_id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                            {p.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-neutral-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-500 text-[11px]">
                        {p.email}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-neutral-900">
                        {p.completed_count} / 50
                      </td>
                      <td className="py-3.5 px-3 text-center font-semibold text-amber-700">
                        {p.current_streak} days
                      </td>
                      <td className="py-3.5 px-3 text-center text-neutral-700">
                        {p.longest_streak} days
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {p.missed_days.length > 0 ? (
                          <span className="text-rose-600 font-medium">{p.missed_days.length} days</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-neutral-900">
                        {p.completion_percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS MANAGEMENT */}
      {activeTab === "submissions" && (
        <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900">All Participant Submissions</h3>
              <p className="text-xs text-neutral-500">
                Inspect code solutions, alternative problem choices, timestamps, and verification status.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search participant, problem, URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-full border border-neutral-300 w-full sm:w-64 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No submissions matching the search query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Day</th>
                    <th className="py-3 px-3">Participant</th>
                    <th className="py-3 px-3">Problem Title</th>
                    <th className="py-3 px-3">GitHub Link</th>
                    <th className="py-3 px-3">Submitted (IST)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-800">
                        Day {sub.challenge_day}
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-900">
                        {sub.participant_name}
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-medium text-neutral-800">
                            {sub.assigned_problem_title}
                          </span>
                          {sub.solved_previously && (
                            <span className="block text-[10px] text-amber-800">
                              Alt: {sub.alternative_problem_name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <a
                          href={sub.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-neutral-950 underline"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[140px]">{sub.github_url}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-neutral-500">
                        {formatIST(sub.submitted_at)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            sub.verification_status === "verified"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : sub.verification_status === "flagged"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {sub.verification_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => verifySubmission(sub.id, "verified")}
                            title="Verify"
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => verifySubmission(sub.id, "flagged")}
                            title="Flag Submission"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PARTICIPANT ALLOWLIST */}
      {activeTab === "allowlist" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              Add New Allowed Participant or Admin
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Only authorized emails can sign in and participate. Add or update the 4 participant emails here.
            </p>

            {allowlistMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-neutral-100 text-neutral-900 text-xs font-medium">
                {allowlistMsg}
              </div>
            )}

            <form onSubmit={handleAddEmail} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Participant Name (e.g. Keerthana)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900"
                required
              />
              <input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900"
                required
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
              >
                <option value="participant">Role: Participant</option>
                <option value="admin">Role: Admin</option>
              </select>
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Allowlist</span>
              </button>
            </form>
          </div>

          <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
            <h3 className="text-base font-bold text-neutral-900 mb-4">
              Current Allowlist Entries
            </h3>

            <div className="divide-y divide-neutral-100">
              {allowedEmails.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {editingAllowlistId === item.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editAllowlistName}
                        onChange={(e) => setEditAllowlistName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editAllowlistEmail}
                        onChange={(e) => setEditAllowlistEmail(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-mono"
                        placeholder="email@example.com"
                      />
                      <div className="flex items-center gap-1.5">
                        <select
                          value={editAllowlistRole}
                          onChange={(e) => setEditAllowlistRole(e.target.value as Role)}
                          className="px-2 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white"
                        >
                          <option value="participant">Participant</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={async () => {
                            if (editAllowlistName.trim() && editAllowlistEmail.trim()) {
                              await updateAllowedEmail(item.id, {
                                name: editAllowlistName.trim(),
                                email: editAllowlistEmail.trim().toLowerCase(),
                                role: editAllowlistRole,
                              });
                              setEditingAllowlistId(null);
                            }
                          }}
                          className="px-3 py-1.5 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingAllowlistId(null)}
                          className="px-2.5 py-1.5 border border-neutral-200 text-neutral-600 rounded-lg text-xs hover:bg-neutral-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-900">{item.name}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-neutral-100 text-neutral-700 uppercase font-medium">
                              {item.role}
                            </span>
                            {!item.is_active && (
                              <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.2 rounded-full">
                                Inactive
                              </span>
                            )}
                            {item.email === "keerthusan0207@gmail.com" && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 font-semibold">
                                Primary Admin
                              </span>
                            )}
                          </div>
                          <span className="text-neutral-500 font-mono text-[11px]">{item.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setEditingAllowlistId(item.id);
                            setEditAllowlistName(item.name);
                            setEditAllowlistEmail(item.email);
                            setEditAllowlistRole(item.role);
                          }}
                          className="text-[11px] text-neutral-700 hover:text-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => updateAllowedEmail(item.id, { is_active: !item.is_active })}
                          className="text-[11px] text-neutral-600 hover:text-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                          {item.is_active ? "Deactivate" : "Activate"}
                        </button>
                        {item.email !== currentUser?.email && (
                          <button
                            onClick={() => deleteAllowedEmail(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Remove from allowlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROADMAP PROBLEM MANAGEMENT */}
      {activeTab === "problems" && (
        <div className="habit-card rounded-3xl p-6 sm:p-8 border border-neutral-200/80 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            50-Day DSA Problem Sequence
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Review or update problem titles, categories, and LeetCode links. Problem order and day numbers are strictly locked to preserve sequence.
          </p>

          <div className="space-y-3">
            {problems.map((prob) => (
              <div
                key={prob.id}
                className="p-3.5 rounded-2xl bg-neutral-50/60 border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-mono font-bold text-neutral-900 w-14">
                    Day {prob.day_number}
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-900">{prob.title}</h4>
                    <span className="text-neutral-400 text-[11px]">
                      {prob.topic} • {prob.difficulty} • Week {prob.week_number}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={prob.leetcode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      setEditingProblem(prob);
                      setEditTitle(prob.title);
                      setEditTopic(prob.topic);
                      setEditUrl(prob.leetcode_url);
                    }}
                    className="px-3 py-1 rounded-full border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900 transition-colors text-[11px] font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Problem Dialog */}
          {editingProblem && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">
                  Edit Problem — Day {editingProblem.day_number}
                </h3>
                <form onSubmit={handleSaveProblem} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      Topic / Category
                    </label>
                    <input
                      type="text"
                      value={editTopic}
                      onChange={(e) => setEditTopic(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                      LeetCode URL
                    </label>
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 font-mono"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProblem(null)}
                      className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
