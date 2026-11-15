/**
 * Challenge Dates & Timezone Utilities
 * All challenge dates and deadlines are interpreted strictly in Asia/Kolkata (IST = UTC+05:30).
 * Start date: November 21, 2026 (Day 1)
 * End date: January 9, 2027 (Day 50)
 * Duration: 50 consecutive calendar days
 */

export const CHALLENGE_CONFIG = {
  name: "50 Days DSA Challenge",
  startDateStr: "2026-11-21", // YYYY-MM-DD
  endDateStr: "2027-01-09",   // YYYY-MM-DD
  timezone: "Asia/Kolkata",
  totalDays: 50,
  startEpochMs: new Date("2026-11-21T00:00:00+05:30").getTime(),
  endEpochMs: new Date("2027-01-09T23:59:59.999+05:30").getTime(),
};

/**
 * Returns current timestamp in IST or uses an optional simulated date string.
 */
export function getNowInIST(simulatedIsoString?: string | null): Date {
  if (simulatedIsoString) {
    return new Date(simulatedIsoString);
  }
  return new Date();
}

/**
 * Get date components in Asia/Kolkata timezone
 */
export function getISTDateParts(date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") {
      partMap[p.type] = parseInt(p.value, 10);
    }
  }

  return {
    year: partMap.year,
    month: partMap.month, // 1-12
    day: partMap.day,     // 1-31
    hour: partMap.hour,   // 0-23
    minute: partMap.minute,
    second: partMap.second,
  };
}

/**
 * Formats a Date object into an IST readable string: e.g. "Nov 21, 2026, 9:30 PM IST"
 */
export function formatIST(dateInput: Date | string | number): string {
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  return (
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date) + " IST"
  );
}

/**
 * Formats a Date to simple date: e.g. "Saturday, 21 November" or "Nov 21, 2026"
 */
export function formatISTDateOnly(dateInput: Date | string | number): string {
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatISTDateWithWeekday(dateInput: Date | string | number): string {
  const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/**
 * Returns the calendar date for Day N of the challenge (1 <= dayNumber <= 50)
 * Day 1 = 2026-11-21
 * Day 50 = 2027-01-09
 */
export function getDateForChallengeDay(dayNumber: number): Date {
  const base = new Date("2026-11-21T00:00:00+05:30");
  const result = new Date(base.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
  return result;
}

/**
 * Returns the exact deadline (11:59:59 PM IST) for Day N
 */
export function getDeadlineForChallengeDay(dayNumber: number): Date {
  const dayStart = getDateForChallengeDay(dayNumber);
  const parts = getISTDateParts(dayStart);
  const monthStr = String(parts.month).padStart(2, "0");
  const dayStr = String(parts.day).padStart(2, "0");
  return new Date(`${parts.year}-${monthStr}-${dayStr}T23:59:59.999+05:30`);
}

export type ChallengeStatus = "upcoming" | "active" | "ended";

export interface ChallengeDayInfo {
  status: ChallengeStatus;
  currentDay: number; // 1-50 (or 0 if upcoming, 51 if ended)
  totalDays: number;
  isUpcoming: boolean;
  hasEnded: boolean;
  isActive: boolean;
  daysUntilStart: number;
  hoursUntilStart: number;
  minutesUntilStart: number;
  secondsUntilStart: number;
  todayDateFormatted: string;
  weekdayFormatted: string;
  deadlineForToday?: Date;
}

/**
 * Calculates the current challenge day given a reference timestamp in IST.
 */
export function getChallengeDayInfo(currentDate: Date = new Date()): ChallengeDayInfo {
  const nowMs = currentDate.getTime();
  const startMs = CHALLENGE_CONFIG.startEpochMs;
  const endMs = CHALLENGE_CONFIG.endEpochMs;

  const msPerDay = 24 * 60 * 60 * 1000;

  if (nowMs < startMs) {
    const diffMs = startMs - nowMs;
    const days = Math.floor(diffMs / msPerDay);
    const hours = Math.floor((diffMs % msPerDay) / (60 * 60 * 1000));
    const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diffMs % (60 * 1000)) / 1000);

    return {
      status: "upcoming",
      currentDay: 0,
      totalDays: 50,
      isUpcoming: true,
      hasEnded: false,
      isActive: false,
      daysUntilStart: days,
      hoursUntilStart: hours,
      minutesUntilStart: minutes,
      secondsUntilStart: seconds,
      todayDateFormatted: formatISTDateOnly(currentDate),
      weekdayFormatted: formatISTDateWithWeekday(currentDate),
    };
  }

  if (nowMs > endMs) {
    return {
      status: "ended",
      currentDay: 51,
      totalDays: 50,
      isUpcoming: false,
      hasEnded: true,
      isActive: false,
      daysUntilStart: 0,
      hoursUntilStart: 0,
      minutesUntilStart: 0,
      secondsUntilStart: 0,
      todayDateFormatted: formatISTDateOnly(currentDate),
      weekdayFormatted: formatISTDateWithWeekday(currentDate),
    };
  }

  // Active challenge: Calculate exact day (Day 1 = Nov 21)
  const diffDays = Math.floor((nowMs - startMs) / msPerDay);
  const currentDay = Math.min(50, Math.max(1, diffDays + 1));

  return {
    status: "active",
    currentDay,
    totalDays: 50,
    isUpcoming: false,
    hasEnded: false,
    isActive: true,
    daysUntilStart: 0,
    hoursUntilStart: 0,
    minutesUntilStart: 0,
    secondsUntilStart: 0,
    todayDateFormatted: formatISTDateOnly(currentDate),
    weekdayFormatted: formatISTDateWithWeekday(currentDate),
    deadlineForToday: getDeadlineForChallengeDay(currentDay),
  };
}

/**
 * Calculate accurate streaks, missed days, and completion percentage for a participant.
 */
export function calculateParticipantStreaks(
  submissions: { challenge_day: number; submitted_at: string; verification_status?: string }[],
  currentChallengeDay: number,
  isChallengeActive: boolean = true
) {
  const submissionMap = new Map<number, { submitted_at: string; status?: string }>();
  for (const s of submissions) {
    submissionMap.set(s.challenge_day, {
      submitted_at: s.submitted_at,
      status: s.verification_status || "verified",
    });
  }

  let completedCount = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;
  const missedDays: number[] = [];

  const maxDayToEvaluate = isChallengeActive ? currentChallengeDay : 50;

  for (let d = 1; d <= maxDayToEvaluate; d++) {
    const sub = submissionMap.get(d);
    const deadline = getDeadlineForChallengeDay(d);
    const isValidSubmission =
      sub && new Date(sub.submitted_at).getTime() <= deadline.getTime() + 60000;

    if (isValidSubmission) {
      completedCount++;
      runningStreak++;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      if (d < currentChallengeDay) {
        missedDays.push(d);
      }
      runningStreak = 0;
    }
  }

  const todaySubmitted = submissionMap.has(currentChallengeDay);
  if (todaySubmitted) {
    currentStreak = runningStreak;
  } else {
    let prevStreak = 0;
    for (let d = currentChallengeDay - 1; d >= 1; d--) {
      const sub = submissionMap.get(d);
      if (sub) {
        prevStreak++;
      } else {
        break;
      }
    }
    currentStreak = prevStreak;
  }

  const completionPercentage = Math.round((completedCount / 50) * 100);

  return {
    completedCount,
    currentStreak,
    longestStreak,
    missedDays,
    completionPercentage,
    todaySubmitted: !!todaySubmitted,
  };
}
