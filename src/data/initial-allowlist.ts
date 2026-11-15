import { AllowedEmail } from "@/types";

export const INITIAL_ALLOWLIST: AllowedEmail[] = [
  {
    id: "allow-0",
    email: "admin@challenge.com",
    name: "Challenge Organizer",
    role: "admin",
    is_active: true,
    created_at: "2026-11-01T00:00:00Z"
  },
  {
    id: "allow-1",
    email: "keerthana@challenge.com",
    name: "Keerthana S",
    role: "participant",
    is_active: true,
    created_at: "2026-11-01T00:00:00Z"
  },
  {
    id: "allow-2",
    email: "participant2@challenge.com",
    name: "Aarav Sharma",
    role: "participant",
    is_active: true,
    created_at: "2026-11-01T00:00:00Z"
  },
  {
    id: "allow-3",
    email: "participant3@challenge.com",
    name: "Rohan Iyer",
    role: "participant",
    is_active: true,
    created_at: "2026-11-01T00:00:00Z"
  },
  {
    id: "allow-4",
    email: "participant4@challenge.com",
    name: "Ananya Patel",
    role: "participant",
    is_active: true,
    created_at: "2026-11-01T00:00:00Z"
  }
];
