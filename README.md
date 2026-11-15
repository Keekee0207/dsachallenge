# 50 Days DSA Challenge Tracker

A minimalist, high-accountability private coding platform designed for exactly four participants to track daily Data Structures and Algorithms problem-solving, GitHub repository commits, consistency streaks, and community momentum across 50 consecutive calendar days.

The user interface follows the clean, monochrome visual language of modern habit trackers: generous whitespace, high-contrast black capsule buttons, 7-segment horizontal progress meters, and circular statistics dials.

---

## 📅 Challenge Specifications

- **Challenge Title**: 50 Days DSA Challenge
- **Start Date**: November 21, 2026 (Day 1)
- **End Date**: January 9, 2027 (Day 50)
- **Duration**: 50 consecutive calendar days
- **Timezone**: Asia/Kolkata (IST = UTC+05:30)
- **Daily Deadline**: 11:59:59 PM IST on each assigned calendar day
- **Participants**: Exactly four authorized participants
- **Admin**: One separate organizer account

---

## 🎨 Design Philosophy & Features

Inspired by modern monochrome habit-tracking applications:
1. **Monochrome Habit Aesthetic**:
   - Clean whites (`#FFFFFF`, `#FAFAFA`) and soft zinc tones.
   - High-contrast black capsule badges (`rounded-full bg-neutral-950 text-white`).
   - 7-segment weekly progress indicators matching the habit-tracker reference design.
   - Circular completion dials and minimalist progress rings.
2. **Dynamic Day & Streak Logic**:
   - Automatically calculates challenge progress based on `November 21, 2026` in `Asia/Kolkata`.
   - Before Nov 21: Displays an upcoming countdown clock and Day 1 preview.
   - During the challenge: Calculates Day 1 through Day 50, strictly enforcing the 11:59 PM IST deadline.
   - Missed days break the current streak and cannot be retroactively submitted.
3. **Daily Submission Workflow**:
   - Direct link to LeetCode with the "Solve Problem" action.
   - "Have you already solved this before?" toggle. If YES, requires alternative problem title and URL.
   - Direct GitHub solution URL validation (`github.com/user/repo/...`).
   - Optional notes field for time/space complexity and reflections.
   - Prevention of duplicate submissions per participant per day.
4. **Day 50 Capstone Assessment**:
   - Multi-problem selection across 3 domains (Array, Linked List/Stack, Tree/Graph).
   - Direct GitHub solution links for all three problems.
   - Approach, complexity analysis, and 50-day learning reflection.
5. **Community Accountability**:
   - "Today's Progress" showing all four participants (Completed with timestamp, or Pending).
   - Real-time community activity feed.
   - Strict privacy: No sensitive credentials or private tokens exposed.
6. **Cohort Leaderboard**:
   - Ranked primarily by total completed problems, with current streak as the tie-breaker.
7. **50-Day Contribution Heatmap & Calendar**:
   - Color-coded cells: Completed (Black), Today (Amber), Missed (Rose), Upcoming (Neutral).
   - Clickable date cells displaying assigned problem and submission history.
8. **Admin Control Center**:
   - Participant allowlist manager (add/edit the 4 emails and admin role).
   - Code submission review and verification (Verify / Flag).
   - Problem roadmap editor.
   - 1-click CSV export of all submissions and participant progress.
9. **Interactive Testing & Day Simulator**:
   - Includes a built-in day simulator modal to test Day 1 (Nov 21), Day 12 (Dec 2), Day 50 (Jan 9), or switch back to real-time.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Timezone Math**: Date-fns and native Intl.DateTimeFormat (Asia/Kolkata)
- **Deployment**: Vercel ready

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase project dashboard.
3. Open `supabase/schema.sql` from this repository and run it to create tables, constraints, indexes, and RLS policies.
4. Open `supabase/seed.sql` and run it to populate:
   - Challenge settings (Start: Nov 21, 2026, End: Jan 9, 2027)
   - Initial allowed emails
   - The complete 50-day DSA Roadmap sequence

### Database Tables:
- `challenge_settings`: Start date, end date, timezone, challenge title
- `allowed_emails`: Email allowlist for access control (`admin`, `participant`)
- `participants`: Participant profiles linked to auth accounts
- `problems`: 50 roadmap problems (day number, week, title, LeetCode link, difficulty, topic)
- `submissions`: Verified daily submissions with GitHub URLs, notes, timestamps, and Day 50 capstone data
- `admin_audit_logs`: Administrative actions log

---

## 🔐 Registered Participants & Admin Access Control

The platform enforces strict private access. Only the organizer and the four participants can sign in with Google or access the challenge:

| Role | Name | Authorized Google Account | Access Rights |
| :--- | :--- | :--- | :--- |
| **Organizer / Admin** | Keerthana S | `keerthusan0207@gmail.com` | Full Admin Dashboard, Verification, Allowlist Management, CSV Export |
| **Participant 1** | Harikirubha | `harikirubha8@gmail.com` | Participant Dashboard, Daily Submissions, Streaks |
| **Participant 2** | Jeshwar Murali | `jeshwarmurali@gmail.com` | Participant Dashboard, Daily Submissions, Streaks |
| **Participant 3** | Raveena S | `raveenas490@gmail.com` | Participant Dashboard, Daily Submissions, Streaks |
| **Participant 4** | Iswarya | `iswarya.250096@ece.ritchennai.edu.in` | Participant Dashboard, Daily Submissions, Streaks |

*Any other Google account will immediately receive an Access Denied restriction.*

### Setting Up Google OAuth in Supabase:
1. In your **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com)):
   - Create an OAuth 2.0 Client ID (Web Application).
   - Add Authorized Redirect URI: `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`.
2. In your **Supabase Dashboard**:
   - Go to **Authentication** -> **Providers** -> **Google**.
   - Enable Google and paste your **Client ID** and **Client Secret**.
   - Set Redirect URL: `http://localhost:3000/auth/callback` (for local dev) and your production Vercel domain `https://your-domain.vercel.app/auth/callback`.

---

## 🚀 Local Development

1. Clone or navigate to the repository:
   ```bash
   cd dsa-challenge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   *(Note: If Supabase credentials are not added yet, the application gracefully functions in local mode with full client interactivity and state persistence so you can test all screens immediately!)*
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Initial commit of 50 Days DSA Challenge Tracker"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will build and deploy your application with zero additional configuration.
