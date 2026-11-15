export type Role = 'admin' | 'participant';

export type VerificationStatus = 'verified' | 'pending' | 'flagged';

export interface AllowedEmail {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface Participant {
  id: string;
  auth_user_id?: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string;
  created_at: string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  day_number: number;
  week_number: number;
  title: string;
  leetcode_url: string;
  topic: string;
  difficulty: Difficulty;
  description?: string;
  week_objective?: string;
  concepts?: string[];
}

export interface Submission {
  id: string;
  participant_id: string;
  participant_name?: string;
  challenge_day: number;
  assigned_problem_id: string;
  assigned_problem_title?: string;
  solved_previously: boolean;
  alternative_problem_name?: string;
  alternative_problem_url?: string;
  github_url: string;
  notes?: string;
  submitted_at: string; // ISO string in UTC or IST
  verification_status: VerificationStatus;
  reviewed_at?: string;
  reviewed_by?: string;
  // Day 50 specific assessment details (optional)
  is_day_50_assessment?: boolean;
  day_50_data?: {
    array_problem_name: string;
    array_github_url: string;
    linked_or_stack_problem_name: string;
    linked_or_stack_github_url: string;
    tree_or_graph_problem_name: string;
    tree_or_graph_github_url: string;
    approach_explanation: string;
    reflections_and_learnings: string;
  };
}

export interface ParticipantStats {
  participant_id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string;
  completed_count: number;
  current_streak: number;
  longest_streak: number;
  missed_days: number[];
  completion_percentage: number;
  last_submitted_day?: number;
  submissions: Submission[];
}

export interface CommunityActivity {
  id: string;
  participant_id: string;
  participant_name: string;
  challenge_day: number;
  problem_title: string;
  submitted_at: string;
  github_url: string;
  is_alternative: boolean;
}

export interface ChallengeSettings {
  id: string;
  challenge_name: string;
  start_date: string; // '2026-11-20'
  end_date: string;   // '2027-01-08'
  timezone: string;   // 'Asia/Kolkata'
  total_days: number; // 50
}
