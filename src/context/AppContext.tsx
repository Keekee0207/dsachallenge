"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import {
  AllowedEmail,
  Participant,
  Problem,
  Submission,
  ParticipantStats,
  CommunityActivity,
  Role,
} from "@/types";
import { DSA_PROBLEMS } from "@/data/problems";
import { INITIAL_ALLOWLIST } from "@/data/initial-allowlist";
import {
  getChallengeDayInfo,
  calculateParticipantStreaks,
  ChallengeDayInfo,
  formatIST,
  getDateForChallengeDay,
} from "@/lib/challenge-dates";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

interface AppContextType {
  // Config & Auth
  isSupabaseConnected: boolean;
  currentUser: Participant | null;
  currentRole: Role;
  isAccessDenied: boolean;
  deniedEmail: string | null;
  setCurrentUser: (user: Participant | null) => void;
  loginAs: (email: string) => boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Date & Challenge Info
  simulatedDate: string | null; // null means live real-world time
  setSimulatedDate: (isoDate: string | null) => void;
  jumpToChallengeDay: (dayNumber: number) => void;
  resetToLiveDate: () => void;
  challengeInfo: ChallengeDayInfo;

  // Data
  problems: Problem[];
  submissions: Submission[];
  allowedEmails: AllowedEmail[];
  participantsList: Participant[];

  // Participant Stats & Leaderboard
  participantStats: ParticipantStats[];
  currentUserStats: ParticipantStats | null;
  communityActivities: CommunityActivity[];
  todayParticipantsProgress: {
    participant: Participant;
    hasCompletedToday: boolean;
    submissionTime?: string;
    githubUrl?: string;
  }[];

  // Actions
  submitSolution: (params: {
    challengeDay: number;
    assignedProblemId: string;
    solvedPreviously: boolean;
    alternativeProblemName?: string;
    alternativeProblemUrl?: string;
    githubUrl: string;
    notes?: string;
    isDay50Assessment?: boolean;
    day50Data?: any;
  }) => Promise<{ success: boolean; error?: string }>;

  // Admin Actions
  verifySubmission: (submissionId: string, status: "verified" | "flagged" | "pending") => Promise<void>;
  updateProblem: (problemId: string, updates: Partial<Problem>) => Promise<void>;
  addAllowedEmail: (email: string, name: string, role: Role) => Promise<boolean>;
  updateAllowedEmail: (id: string, updates: Partial<AllowedEmail>) => Promise<void>;
  deleteAllowedEmail: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SUBMISSIONS: "dsa_challenge_submissions_v3",
  ALLOWED_EMAILS: "dsa_challenge_allowed_emails_v3",
  PROBLEMS: "dsa_challenge_problems_v3",
  CURRENT_USER: "dsa_challenge_current_user_v3",
  SIMULATED_DATE: "dsa_challenge_simulated_date_v3",
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const isSupabaseConnected = isSupabaseConfigured();
  
  // Initialize state
  const [currentUser, setCurrentUserState] = useState<Participant | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState<boolean>(false);
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>(INITIAL_ALLOWLIST);
  const [problems, setProblems] = useState<Problem[]>(DSA_PROBLEMS);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [simulatedDate, setSimulatedDateState] = useState<string | null>(null);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedAllowlist = localStorage.getItem(STORAGE_KEYS.ALLOWED_EMAILS);
      if (storedAllowlist) {
        setAllowedEmails(JSON.parse(storedAllowlist));
      } else {
        localStorage.setItem(STORAGE_KEYS.ALLOWED_EMAILS, JSON.stringify(INITIAL_ALLOWLIST));
      }

      const storedProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
      if (storedProblems) {
        setProblems(JSON.parse(storedProblems));
      }

      const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        setCurrentUserState(JSON.parse(storedUser));
      } else {
        // Default login as Organizer Admin (keerthusan0207@gmail.com)
        const defaultUser: Participant = {
          id: "p-allow-admin",
          email: "keerthusan0207@gmail.com",
          name: "Keerthana S (Admin)",
          role: "admin",
          created_at: new Date().toISOString(),
        };
        setCurrentUserState(defaultUser);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      }

      const storedSimulatedDate = localStorage.getItem(STORAGE_KEYS.SIMULATED_DATE);
      if (storedSimulatedDate) {
        setSimulatedDateState(storedSimulatedDate);
      }
    } catch (e) {
      console.error("Failed to load initial data from storage", e);
    }
  }, []);

  // Update current user
  const setCurrentUser = (user: Participant | null) => {
    setCurrentUserState(user);
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  };

  // Login handler with email allowlist checking
  const loginAs = (inputEmail: string): boolean => {
    const cleanEmail = inputEmail.trim().toLowerCase();
    const allowed = allowedEmails.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.is_active
    );

    if (!allowed) {
      setIsAccessDenied(true);
      setDeniedEmail(cleanEmail);
      return false;
    }

    setIsAccessDenied(false);
    setDeniedEmail(null);

    const user: Participant = {
      id: `p-${allowed.id}`,
      email: allowed.email,
      name: allowed.name,
      role: allowed.role,
      created_at: allowed.created_at || new Date().toISOString(),
    };

    setCurrentUser(user);
    return true;
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConnected) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      return {
        success: false,
        error: "Supabase Google OAuth credentials not found in .env.local. You can test sign-in instantly using the authorized Google accounts listed below!",
      };
    }
  };

  const logout = async () => {
    if (isSupabaseConnected) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Supabase signOut error", e);
      }
    }
    setCurrentUser(null);
    setIsAccessDenied(false);
    setDeniedEmail(null);
  };

  // Date simulation handlers
  const setSimulatedDate = (dateStr: string | null) => {
    setSimulatedDateState(dateStr);
    if (typeof window !== "undefined") {
      if (dateStr) {
        localStorage.setItem(STORAGE_KEYS.SIMULATED_DATE, dateStr);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SIMULATED_DATE);
      }
    }
  };

  const jumpToChallengeDay = (dayNumber: number) => {
    const targetDate = getDateForChallengeDay(dayNumber);
    // Set to 2:00 PM IST on that day for testing
    const simulated = new Date(targetDate.getTime() + 14 * 60 * 60 * 1000).toISOString();
    setSimulatedDate(simulated);
  };

  const resetToLiveDate = () => {
    setSimulatedDate(null);
  };

  // Calculate current challenge day info based on active date
  const challengeInfo = useMemo(() => {
    const refDate = simulatedDate ? new Date(simulatedDate) : new Date();
    return getChallengeDayInfo(refDate);
  }, [simulatedDate]);

  // Generate 4 active participants list
  const participantsList = useMemo(() => {
    return allowedEmails
      .filter((a) => a.role === "participant" && a.is_active)
      .slice(0, 4)
      .map((a) => ({
        id: `p-${a.id}`,
        email: a.email,
        name: a.name,
        role: a.role,
        avatar_url: undefined,
        created_at: a.created_at,
      }));
  }, [allowedEmails]);

  // Compute stats and streaks for all participants
  const participantStats = useMemo(() => {
    return participantsList.map((p) => {
      const userSubmissions = submissions.filter((s) => s.participant_id === p.id);
      const stats = calculateParticipantStreaks(
        userSubmissions,
        challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1,
        challengeInfo.isActive
      );

      return {
        participant_id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        avatar_url: p.avatar_url,
        completed_count: stats.completedCount,
        current_streak: stats.currentStreak,
        longest_streak: stats.longestStreak,
        missed_days: stats.missedDays,
        completion_percentage: stats.completionPercentage,
        submissions: userSubmissions,
      };
    }).sort((a, b) => {
      // Primary: completed count desc, Secondary: current streak desc, Tertiary: longest streak desc
      if (b.completed_count !== a.completed_count) {
        return b.completed_count - a.completed_count;
      }
      if (b.current_streak !== a.current_streak) {
        return b.current_streak - a.current_streak;
      }
      return b.longest_streak - a.longest_streak;
    });
  }, [participantsList, submissions, challengeInfo]);

  // Current user's stats
  const currentUserStats = useMemo(() => {
    if (!currentUser) return null;
    return participantStats.find((p) => p.participant_id === currentUser.id) || null;
  }, [currentUser, participantStats]);

  // Today's Progress across all 4 participants
  const todayParticipantsProgress = useMemo(() => {
    const currentDay = challengeInfo.currentDay;
    return participantsList.map((participant) => {
      const todaySub = submissions.find(
        (s) => s.participant_id === participant.id && s.challenge_day === currentDay
      );
      return {
        participant,
        hasCompletedToday: !!todaySub,
        submissionTime: todaySub ? formatIST(todaySub.submitted_at) : undefined,
        githubUrl: todaySub?.github_url,
      };
    });
  }, [participantsList, submissions, challengeInfo.currentDay]);

  // Community Activity Feed
  const communityActivities = useMemo(() => {
    return submissions
      .slice()
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
      .map((s) => ({
        id: s.id,
        participant_id: s.participant_id,
        participant_name: s.participant_name || "Participant",
        challenge_day: s.challenge_day,
        problem_title: s.assigned_problem_title || `Day ${s.challenge_day} Problem`,
        submitted_at: s.submitted_at,
        github_url: s.github_url,
        is_alternative: s.solved_previously,
      }));
  }, [submissions]);

  // Submit Daily Solution
  const submitSolution = async (params: {
    challengeDay: number;
    assignedProblemId: string;
    solvedPreviously: boolean;
    alternativeProblemName?: string;
    alternativeProblemUrl?: string;
    githubUrl: string;
    notes?: string;
    isDay50Assessment?: boolean;
    day50Data?: any;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Please log in to submit." };
    }

    // Validate that day does not exceed current challenge day
    if (challengeInfo.isUpcoming) {
      return { success: false, error: "The challenge has not started yet. Stay tuned!" };
    }

    if (params.challengeDay > challengeInfo.currentDay) {
      return { success: false, error: "You cannot submit solutions for future days." };
    }

    // Check duplicate submission
    const existing = submissions.find(
      (s) => s.participant_id === currentUser.id && s.challenge_day === params.challengeDay
    );
    if (existing) {
      return { success: false, error: `You have already submitted a solution for Day ${params.challengeDay}.` };
    }

    // Validate GitHub URL
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i;
    if (!githubRegex.test(params.githubUrl.trim())) {
      return {
        success: false,
        error: "Please enter a valid GitHub repository or file URL (e.g., https://github.com/username/repo/blob/...)",
      };
    }

    // Validate alternative problem fields if solved previously
    if (params.solvedPreviously) {
      if (!params.alternativeProblemName?.trim()) {
        return { success: false, error: "Please enter the alternative problem name." };
      }
      if (!params.alternativeProblemUrl?.trim()) {
        return { success: false, error: "Please enter the alternative LeetCode or practice URL." };
      }
    }

    // Assigned problem title lookup
    const assignedProb = problems.find((p) => p.id === params.assignedProblemId);

    const newSubmission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      participant_id: currentUser.id,
      participant_name: currentUser.name,
      challenge_day: params.challengeDay,
      assigned_problem_id: params.assignedProblemId,
      assigned_problem_title: assignedProb?.title || `Day ${params.challengeDay} Problem`,
      solved_previously: params.solvedPreviously,
      alternative_problem_name: params.alternativeProblemName,
      alternative_problem_url: params.alternativeProblemUrl,
      github_url: params.githubUrl.trim(),
      notes: params.notes?.trim(),
      submitted_at: simulatedDate ? new Date(simulatedDate).toISOString() : new Date().toISOString(),
      verification_status: "verified",
      is_day_50_assessment: params.isDay50Assessment,
      day_50_data: params.day50Data,
    };

    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
    }

    return { success: true };
  };

  // Admin Actions
  const verifySubmission = async (submissionId: string, status: "verified" | "flagged" | "pending") => {
    const updated = submissions.map((s) => (s.id === submissionId ? { ...s, verification_status: status } : s));
    setSubmissions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
    }
  };

  const updateProblem = async (problemId: string, updates: Partial<Problem>) => {
    const updated = problems.map((p) => (p.id === problemId ? { ...p, ...updates } : p));
    setProblems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updated));
    }
  };

  const addAllowedEmail = async (email: string, name: string, role: Role): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (allowedEmails.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return false;
    }
    const newEntry: AllowedEmail = {
      id: `allow-${Date.now()}`,
      email: cleanEmail,
      name: name.trim(),
      role,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    const updated = [...allowedEmails, newEntry];
    setAllowedEmails(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ALLOWED_EMAILS, JSON.stringify(updated));
    }
    return true;
  };

  const updateAllowedEmail = async (id: string, updates: Partial<AllowedEmail>) => {
    const updated = allowedEmails.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setAllowedEmails(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ALLOWED_EMAILS, JSON.stringify(updated));
    }
  };

  const deleteAllowedEmail = async (id: string) => {
    const updated = allowedEmails.filter((a) => a.id !== id);
    setAllowedEmails(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ALLOWED_EMAILS, JSON.stringify(updated));
    }
  };

  return (
    <AppContext.Provider
      value={{
        isSupabaseConnected,
        currentUser,
        currentRole: currentUser?.role || "participant",
        isAccessDenied,
        deniedEmail,
        setCurrentUser,
        loginAs,
        signInWithGoogle,
        logout,
        simulatedDate,
        setSimulatedDate,
        jumpToChallengeDay,
        resetToLiveDate,
        challengeInfo,
        problems,
        submissions,
        allowedEmails,
        participantsList,
        participantStats,
        currentUserStats,
        communityActivities,
        todayParticipantsProgress,
        submitSolution,
        verifySubmission,
        updateProblem,
        addAllowedEmail,
        updateAllowedEmail,
        deleteAllowedEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
