"use client";

import React from "react";
import { CelebrationProvider, useCelebration } from "@/components/CelebrationContext";
import { TeaserGate } from "@/components/TeaserGate";
import { CelebrationHeader } from "@/components/CelebrationHeader";
import { BirthdayVideoPlayer } from "@/components/BirthdayVideoPlayer";
import { VirtualCake } from "@/components/VirtualCake";
import { AudioJukebox } from "@/components/AudioJukebox";
import { SecretWishModal } from "@/components/SecretWishModal";
import { FriendWishesWall } from "@/components/FriendWishesWall";
import { celebrationConfig } from "@/config/celebration.config";
import { Sparkle, Heart, Cake } from "@phosphor-icons/react";

function CelebrationDashboardContent() {
  const { isCelebrated, relightKey } = useCelebration();

  if (!isCelebrated) {
    return <TeaserGate />;
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-gradient-to-br from-[#fff0f5] via-[#fdf2f8] to-[#fce7f3] text-[#4c0519] selection:bg-pink-200 selection:text-[#831843]">
      <CelebrationHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col gap-8">
        {/* Top Greeting Banner */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9d174d] px-3.5 py-1 rounded-full bg-pink-100 border border-pink-200/90 flex items-center gap-1.5 font-semibold shadow-xs">
              <Sparkle size={14} weight="fill" className="text-pink-600" />
              Celebration Dashboard
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#831843] leading-tight">
            Happy Birthday, {celebrationConfig.recipientName}!
          </h2>
          <p className="text-sm md:text-base text-[#9d174d] max-w-[65ch] font-medium leading-relaxed">
            {celebrationConfig.milestone}. Watch your special birthday animation reel, blow out your candles to unlock your secret wish, and listen to personal voice messages from your closest friends.
          </p>
        </section>

        {/* Asymmetric 2-Column Celebration Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Video & Cake) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <BirthdayVideoPlayer />
            <VirtualCake key={relightKey} />
          </div>

          {/* Right Column (Audio Jukebox & Friendship Card) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <AudioJukebox />

            {/* Friendship Highlights Card in Girly Pink */}
            <div className="w-full bg-white/85 border border-pink-200/90 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_12px_35px_rgba(236,72,153,0.12)]">
              <div className="flex items-center gap-2">
                <Heart size={20} weight="duotone" className="text-pink-600" />
                <h3 className="text-base font-bold text-[#831843] tracking-tight">
                  Friendship Snapshot
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-100 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#9d174d] uppercase font-semibold">
                    Birthday Queen
                  </span>
                  <span className="text-sm font-bold text-[#831843]">
                    {celebrationConfig.recipientName}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-100 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#9d174d] uppercase font-semibold">
                    Cake Status
                  </span>
                  <span className="text-sm font-bold text-pink-600 flex items-center gap-1.5">
                    <Cake size={16} weight="duotone" />
                    3 Lit Candles
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-pink-100/70 border border-pink-200 flex items-start gap-3">
                <Sparkle size={18} weight="fill" className="text-pink-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#831843] leading-relaxed font-medium">
                  Blow directly into your microphone or tap the cake candles to extinguish the flames and reveal the sealed birthday card note.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wishes From Loved Ones */}
        <FriendWishesWall />
      </main>

      {/* Secret Wish Reveal Modal */}
      <SecretWishModal />

      {/* Footer in Soft Pink */}
      <footer className="w-full py-6 px-4 border-t border-pink-200/80 text-center text-xs text-[#9d174d] font-mono bg-white/40">
        Made with celebration love for {celebrationConfig.recipientName}
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <CelebrationProvider>
      <CelebrationDashboardContent />
    </CelebrationProvider>
  );
}
