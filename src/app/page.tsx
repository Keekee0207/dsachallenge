"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { TodayChallengeCard } from "@/components/dashboard/TodayChallengeCard";
import { HabitActivityGrid } from "@/components/dashboard/HabitActivityGrid";
import { SegmentedWeekProgress } from "@/components/dashboard/SegmentedWeekProgress";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { CommunityActivity } from "@/components/dashboard/CommunityActivity";
import { SubmitModal } from "@/components/modals/SubmitModal";
import { Day50AssessmentModal } from "@/components/modals/Day50AssessmentModal";
import { Problem } from "@/types";

export default function DashboardPage() {
  const { problems, challengeInfo } = useApp();

  const [activeProblemForSubmit, setActiveProblemForSubmit] = useState<Problem | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [day50ModalOpen, setDay50ModalOpen] = useState(false);

  const handleOpenSubmit = (problem: Problem) => {
    setActiveProblemForSubmit(problem);
    setSubmitModalOpen(true);
  };

  const handleOpenDay50 = (problem: Problem) => {
    setActiveProblemForSubmit(problem);
    setDay50ModalOpen(true);
  };

  return (
    <div className="space-y-2">
      {/* 1. Welcome Section */}
      <WelcomeSection />

      {/* 2. Progress Overview (4 Minimal Cards) */}
      <ProgressOverview />

      {/* 3. Today's Challenge (Main Focus) */}
      <TodayChallengeCard
        onOpenSubmitModal={handleOpenSubmit}
        onOpenDay50Modal={handleOpenDay50}
      />

      {/* 4. Habit Activity Grid (Design Inspiration Screen 2) */}
      <HabitActivityGrid
        onOpenSubmitModal={handleOpenSubmit}
        onOpenDay50Modal={handleOpenDay50}
      />

      {/* 5. 7-Day Segmented Progress Bar (Design Inspiration Screen 2) */}
      <SegmentedWeekProgress />

      {/* 6. Current Week Schedule & History */}
      <WeeklyProgress />

      {/* 7. Community Activity & Today's Progress (4-participant accountability) */}
      <CommunityActivity />

      {/* Modals */}
      <SubmitModal
        problem={activeProblemForSubmit}
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />

      {activeProblemForSubmit && (
        <Day50AssessmentModal
          problem={activeProblemForSubmit}
          isOpen={day50ModalOpen}
          onClose={() => setDay50ModalOpen(false)}
        />
      )}
    </div>
  );
}
