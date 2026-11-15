"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Calendar, Clock, RotateCcw, Check, Zap } from "lucide-react";
import { getDateForChallengeDay, formatIST, formatISTDateOnly } from "@/lib/challenge-dates";

interface DateSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DateSimulatorModal: React.FC<DateSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { simulatedDate, jumpToChallengeDay, resetToLiveDate, challengeInfo } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(
    challengeInfo.currentDay > 0 ? challengeInfo.currentDay : 1
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-elevated border border-neutral-200 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Testing &amp; Evaluation
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-neutral-900 mb-1">
          Challenge Day Simulator
        </h3>

        <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
          The challenge is scheduled from <strong>Nov 21, 2026 to Jan 9, 2027 (IST)</strong>. Use
          this tool to simulate any challenge day to test problem unlocking, streak calculations,
          and Day 50 capstone flows.
        </p>

        {/* Current status */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 mb-5 text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-neutral-500">Active Simulation:</span>
            <span className="font-bold text-neutral-900 font-mono">
              {simulatedDate
                ? challengeInfo.currentDay > 0
                  ? `Day ${challengeInfo.currentDay}`
                  : "Pre-Challenge Countdown"
                : "Real-time Live IST"}
            </span>
          </div>
          <div className="flex justify-between items-center text-neutral-600">
            <span>Simulated Date:</span>
            <span className="font-mono text-[11px]">{challengeInfo.todayDateFormatted}</span>
          </div>
        </div>

        {/* Quick jump presets */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                jumpToChallengeDay(1);
                onClose();
              }}
              className="p-2.5 rounded-2xl border border-neutral-200 hover:border-neutral-900 text-center text-xs font-semibold hover:bg-neutral-50 transition-all"
            >
              Day 1 (Nov 21)
              <span className="block text-[10px] text-neutral-400 font-normal">Kickoff</span>
            </button>
            <button
              onClick={() => {
                jumpToChallengeDay(12);
                onClose();
              }}
              className="p-2.5 rounded-2xl border border-neutral-200 hover:border-neutral-900 text-center text-xs font-semibold hover:bg-neutral-50 transition-all"
            >
              Day 12 (Dec 2)
              <span className="block text-[10px] text-neutral-400 font-normal">Mid-Week 2</span>
            </button>
            <button
              onClick={() => {
                jumpToChallengeDay(50);
                onClose();
              }}
              className="p-2.5 rounded-2xl border border-neutral-200 hover:border-neutral-900 text-center text-xs font-semibold hover:bg-neutral-50 transition-all"
            >
              Day 50 (Jan 9)
              <span className="block text-[10px] text-neutral-400 font-normal">Capstone</span>
            </button>
          </div>
        </div>

        {/* Jump to specific day */}
        <div className="mb-6">
          <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-2">
            Jump to Day (1 to 50)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={50}
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value, 10) || 1)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 font-mono text-center"
            />
            <button
              onClick={() => {
                jumpToChallengeDay(selectedDay);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              Set Day
            </button>
          </div>
        </div>

        {/* Reset to live */}
        <button
          onClick={() => {
            resetToLiveDate();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Actual Live Real-Time</span>
        </button>
      </div>
    </div>
  );
};
