"use client";

import React from "react";
import { X, Sparkle, Heart, ArrowCounterClockwise } from "@phosphor-icons/react";
import { celebrationConfig } from "@/config/celebration.config";
import { useCelebration } from "./CelebrationContext";

export function SecretWishModal() {
  const { showWishModal, setShowWishModal, relightCandles } = useCelebration();

  if (!showWishModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#fff5f8] border-2 border-pink-300 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(236,72,153,0.25),0_0_50px_rgba(251,113,133,0.15)] flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => setShowWishModal(false)}
          aria-label="Close wish card"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-[#831843] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Pink Wax Seal Emblem with Heart */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(236,72,153,0.35)] mb-4">
          <Heart size={30} weight="fill" />
        </div>

        {/* Secret Wish Eyebrow & Title */}
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#9d174d] mb-2 font-semibold">
          Sealed Birthday Message
        </span>

        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#831843] mb-4">
          {celebrationConfig.cake.secretWish.headline}
        </h3>

        {/* Card Body */}
        <div className="w-full bg-white/95 rounded-2xl p-6 border border-pink-200 mb-6 text-left relative shadow-sm">
          <Sparkle size={18} weight="fill" className="absolute top-4 right-4 text-pink-400" />
          <p className="text-sm md:text-base text-[#4c0519] leading-relaxed font-sans mb-4 font-medium">
            {celebrationConfig.cake.secretWish.message}
          </p>
          <div className="border-t border-pink-200 pt-3 mt-4 flex flex-col">
            <span className="text-xs text-[#9d174d] italic font-medium">
              {celebrationConfig.cake.secretWish.signOff}
            </span>
            <span className="text-sm font-bold text-pink-600 mt-0.5">
              {celebrationConfig.cake.secretWish.senderName}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={() => setShowWishModal(false)}
            className="flex-1 min-w-[140px] h-11 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
          >
            Keep Celebrating
          </button>
          <button
            onClick={relightCandles}
            className="h-11 px-5 rounded-full border border-pink-300 bg-pink-100 hover:bg-pink-200 text-[#831843] transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
          >
            <ArrowCounterClockwise size={16} weight="bold" />
            <span>Relight Candles</span>
          </button>
        </div>
      </div>
    </div>
  );
}
