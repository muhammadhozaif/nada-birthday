"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Sparkle, X, EnvelopeOpen, Microphone, Play, Pause } from "@phosphor-icons/react";
import { celebrationConfig, FriendWish } from "@/config/celebration.config";
import { useCelebration } from "./CelebrationContext";

export function FriendWishesWall() {
  const [selectedWish, setSelectedWish] = useState<FriendWish | null>(null);
  const { playJukeboxTrack, currentJukeboxTrackId, activeAudioSource, setActiveAudioSource } =
    useCelebration();

  const wishes = celebrationConfig.friendWishes;
  const isJukeboxPlaying = activeAudioSource === "jukebox";

  const isWishAudioPlaying = (wish: FriendWish) => {
    if (!wish.audioUrl || !isJukeboxPlaying) return false;
    return (
      currentJukeboxTrackId === wish.id ||
      currentJukeboxTrackId === wish.audioUrl ||
      (currentJukeboxTrackId === "memo-1" && wish.sender === "Hayati") ||
      (currentJukeboxTrackId === "memo-3" && wish.sender === "Glamira") ||
      (currentJukeboxTrackId === "memo-5" && wish.sender === "Spate")
    );
  };

  const toggleWishAudio = (wish: FriendWish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!wish.audioUrl) return;

    if (isWishAudioPlaying(wish)) {
      setActiveAudioSource("none");
    } else {
      const trackId =
        wish.sender === "Hayati"
          ? "memo-1"
          : wish.sender === "Glamira"
          ? "memo-3"
          : wish.sender === "Spate"
          ? "memo-5"
          : wish.audioUrl;
      playJukeboxTrack(trackId);
    }
  };

  return (
    <section className="w-full flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 shadow-xs">
            <EnvelopeOpen size={20} weight="fill" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#831843]">
              Wishes From Loved Ones
            </h2>
            <p className="text-xs text-[#9d174d] font-medium">
              Special messages and heartfelt notes sent with love for Nada
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto text-[11px] font-mono uppercase tracking-wider text-[#9d174d] px-3 py-1 rounded-full bg-pink-100 border border-pink-200/90 font-semibold shadow-xs">
          {wishes.length} Special Wishes
        </span>
      </div>

      {/* Balanced 3-Column Responsive Grid - Perfectly Even Column Heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            onClick={() => setSelectedWish(wish)}
            className="group bg-white/95 border border-pink-200/90 rounded-2xl p-5 shadow-[0_8px_25px_rgba(236,72,153,0.08)] hover:shadow-[0_16px_38px_rgba(236,72,153,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              {/* Card Header with Sender Avatar & Tag */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                    {wish.sender.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#831843] truncate">
                      {wish.sender}
                    </h3>
                    <p className="text-[10px] text-[#9d174d] truncate">
                      {wish.displayName}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-pink-100 text-[#9d174d] border border-pink-200/80 font-semibold flex-shrink-0">
                  {wish.tag}
                </span>
              </div>

              {/* Calibrated Image Frame - Even Heights Across All Cards */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-[#1e2c25] border border-pink-200/80 group-hover:border-pink-300 transition-colors flex items-center justify-center p-2.5 shadow-inner">
                <Image
                  src={wish.image}
                  alt={`Birthday wish from ${wish.sender}`}
                  width={wish.width}
                  height={wish.height}
                  unoptimized
                  priority
                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2.5 pointer-events-none">
                  <span className="text-[11px] font-bold text-white bg-pink-600/90 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                    <Sparkle size={13} weight="fill" />
                    <span>Click to View Full Letter</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card Action Hint & Voice Note Button */}
            <div className="pt-2.5 border-t border-pink-100/90 flex items-center justify-between text-xs font-bold text-pink-600">
              <span className="flex items-center gap-1.5 min-w-0 truncate">
                <Heart size={14} weight="fill" className="text-pink-500 flex-shrink-0" />
                <span className="truncate">Wish From {wish.sender}</span>
              </span>

              {wish.audioUrl ? (
                <button
                  onClick={(e) => toggleWishAudio(wish, e)}
                  aria-label={`Play voice note from ${wish.sender}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs flex-shrink-0 ${
                    isWishAudioPlaying(wish)
                      ? "bg-pink-600 text-white border-pink-600 animate-pulse"
                      : "bg-pink-100 hover:bg-pink-200 text-[#831843] border-pink-200/90"
                  }`}
                >
                  <Microphone size={12} weight="fill" />
                  <span>{isWishAudioPlaying(wish) ? "Playing" : "Voice Note"}</span>
                  <span className="font-mono text-[10px] opacity-80">{wish.audioDuration}</span>
                </button>
              ) : (
                <Sparkle
                  size={14}
                  weight="fill"
                  className="text-pink-400 group-hover:rotate-45 transition-transform flex-shrink-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal - Clean, Uncropped Full View */}
      {selectedWish && (
        <div
          onClick={() => setSelectedWish(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-pink-950/65 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-fit max-w-2xl bg-[#fff5f8] border-2 border-pink-300 rounded-3xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(236,72,153,0.3)] flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto mx-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-pink-200 pb-2.5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                  {selectedWish.sender.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#831843]">
                    Wish From {selectedWish.sender}
                  </h3>
                  <p className="text-xs text-[#9d174d] font-medium">
                    {selectedWish.displayName} • {selectedWish.tag}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedWish(null)}
                aria-label="Close letter"
                className="w-9 h-9 rounded-full bg-pink-100 hover:bg-pink-200 text-[#831843] flex items-center justify-center transition-colors cursor-pointer shadow-xs flex-shrink-0"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Voice Note Banner if friend has real audio */}
            {selectedWish.audioUrl && (
              <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-100/90 via-[#fff0f5] to-rose-100/90 border border-pink-300/80 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 ${
                      isWishAudioPlaying(selectedWish)
                        ? "bg-gradient-to-tr from-pink-600 to-rose-500 text-white animate-spin"
                        : "bg-gradient-to-tr from-pink-500 to-rose-400 text-white"
                    }`}
                  >
                    <Microphone size={15} weight="fill" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#831843] truncate">
                      Listen to {selectedWish.sender}&apos;s Real Voice Note
                    </p>
                    <p className="text-[10px] text-[#9d174d] truncate font-medium">
                      Duration: {selectedWish.audioDuration} • Tap to hear the recorded voice message
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleWishAudio(selectedWish)}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {isWishAudioPlaying(selectedWish) ? (
                    <>
                      <Pause size={13} weight="bold" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} weight="fill" />
                      <span>Play ({selectedWish.audioDuration})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Modal Image - Proportionally Fitted So 100% of Text is Visible On Screen */}
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden border border-pink-200 shadow-md bg-[#1e2c25] p-2">
              <Image
                src={selectedWish.image}
                alt={`Birthday wish from ${selectedWish.sender}`}
                width={selectedWish.width}
                height={selectedWish.height}
                unoptimized
                priority
                className="max-h-[66vh] max-w-full w-auto h-auto object-contain rounded-xl block select-none mx-auto"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between text-xs text-[#9d174d] font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Heart size={15} weight="fill" className="text-pink-500" />
                <span>Sent with love for Nada</span>
              </span>
              <button
                onClick={() => setSelectedWish(null)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs hover:from-pink-600 hover:to-rose-600 transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
