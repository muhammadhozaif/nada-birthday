"use client";

import React from "react";
import { Confetti, Cake } from "@phosphor-icons/react";
import { celebrationConfig } from "@/config/celebration.config";
import { useCelebration } from "./CelebrationContext";

export function CelebrationHeader() {
  const { blastConfetti } = useCelebration();

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-5 px-6 md:px-10 border-b border-pink-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 shadow-sm">
          <Cake size={22} weight="fill" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#831843]">
              {celebrationConfig.eventTitle}
            </h1>
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-pink-100 text-[#9d174d] border border-pink-200/90 font-semibold">
              Queen Mode
            </span>
          </div>
          <p className="text-xs text-[#9d174d] hidden sm:block">
            {celebrationConfig.milestone}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Persistent Blast Confetti CTA */}
        <button
          onClick={blastConfetti}
          className="h-10 px-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_22px_rgba(236,72,153,0.45)] hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
        >
          <Confetti size={18} weight="bold" className="text-pink-100" />
          <span>Blast Confetti</span>
        </button>
      </div>
    </header>
  );
}
