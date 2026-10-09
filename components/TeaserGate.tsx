"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkle, Gift, Confetti, LockOpen, Crown } from "@phosphor-icons/react";
import { celebrationConfig } from "@/config/celebration.config";
import { useCelebration } from "./CelebrationContext";

export function TeaserGate() {
  const { launchCelebration } = useCelebration();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-[#fff0f5] via-[#fdf2f8] to-[#fce7f3] text-[#4c0519]">
      {/* Ambient pink glowing orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[620px] h-[340px] md:h-[620px] rounded-full pointer-events-none opacity-40 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #f472b6 0%, #fda4af 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #ec4899 0%, #fbcfe8 50%, transparent 70%)",
        }}
      />

      {/* Decorative stars & sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkle
          className="absolute top-[18%] left-[12%] text-pink-400 animate-pulse"
          size={24}
          weight="fill"
        />
        <Sparkle
          className="absolute top-[26%] right-[14%] text-rose-300 animate-pulse"
          size={20}
          weight="fill"
        />
        <Sparkle
          className="absolute bottom-[20%] left-[18%] text-pink-300 animate-pulse"
          size={22}
          weight="fill"
        />
        <Sparkle
          className="absolute bottom-[16%] right-[16%] text-rose-400 animate-pulse"
          size={26}
          weight="fill"
        />
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl text-center flex flex-col items-center"
      >
        {/* Envelope/Gift Emblem with Crown */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 rounded-2xl bg-white/90 border border-pink-200/80 flex items-center justify-center text-pink-500 shadow-[0_10px_30px_rgba(236,72,153,0.18)]">
            <Gift size={38} weight="duotone" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md">
            <Crown size={15} weight="bold" />
          </div>
        </div>

        {/* Header Stack */}
        <span className="text-[12px] font-mono tracking-widest uppercase text-[#9d174d] mb-3 px-3.5 py-1 rounded-full bg-pink-100 border border-pink-200/80 font-medium">
          Special Delivery For {celebrationConfig.recipientName}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#831843] mb-4">
          A Birthday Surprise Awaits
        </h1>

        <p className="text-base text-[#9d174d] leading-relaxed max-w-[42ch] mb-8 font-medium">
          {celebrationConfig.surprisePrompt}
        </p>

        {/* Tactile Primary Button */}
        <button
          onClick={launchCelebration}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg shadow-[0_10px_35px_rgba(236,72,153,0.35)] hover:shadow-[0_14px_45px_rgba(236,72,153,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Confetti size={24} weight="bold" className="group-hover:rotate-12 transition-transform text-pink-100" />
          <span>Press to Celebrate</span>
          <LockOpen size={20} weight="bold" className="text-pink-100" />
        </button>

        <p className="text-xs text-[#be185d] mt-5 font-mono">
          Turn your sound up for party mode
        </p>
      </motion.div>
    </div>
  );
}
