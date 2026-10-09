"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Disc,
  Microphone,
  Sparkle,
} from "@phosphor-icons/react";
import { celebrationConfig, PlaylistItem } from "@/config/celebration.config";
import { useCelebration } from "./CelebrationContext";
import { soundEffects } from "@/utils/audio-synth";

export function AudioJukebox() {
  const { activeAudioSource, setActiveAudioSource, currentJukeboxTrackId } = useCelebration();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const isPlaying = activeAudioSource === "jukebox";
  const [progressSec, setProgressSec] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = celebrationConfig.jukebox.playlist;
  const currentTrack: PlaylistItem = tracks[currentTrackIndex] || tracks[0];

  const parseDurationSec = (durationStr: string) => {
    const parts = durationStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 15;
  };

  const totalDurationSec = parseDurationSec(currentTrack.duration);

  // Sync when track requested via CelebrationContext
  useEffect(() => {
    if (!currentJukeboxTrackId) return;
    const idx = tracks.findIndex(
      (t) => t.id === currentJukeboxTrackId || t.audioUrl === currentJukeboxTrackId
    );
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setProgressSec(0);
    }
  }, [currentJukeboxTrackId, tracks]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgressSec(0);
    soundEffects.playTactileClick();
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgressSec(0);
    soundEffects.playTactileClick();
  }, [tracks.length]);

  // Handle actual audio play/pause when isPlaying or track changes
  useEffect(() => {
    if (isPlaying) {
      if (currentTrack.audioUrl && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, currentTrack.audioUrl]);

  // When activeAudioSource changes away from jukebox
  useEffect(() => {
    if (activeAudioSource !== "jukebox" && audioRef.current) {
      audioRef.current.pause();
    }
  }, [activeAudioSource]);

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActiveAudioSource("none");
    } else {
      setActiveAudioSource("jukebox");
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setProgressSec(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.floor(pct * totalDurationSec);
    if (audioRef.current && currentTrack.audioUrl) {
      audioRef.current.currentTime = targetSec;
    }
    setProgressSec(targetSec);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full bg-white/85 border border-pink-200/90 rounded-2xl p-6 flex flex-col gap-5 shadow-[0_12px_35px_rgba(236,72,153,0.12)] relative">
      {/* Real audio element */}
      {currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={nextTrack}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Microphone size={22} weight="duotone" className="text-pink-600" />
          <h3 className="text-base font-bold text-[#831843] tracking-tight">
            Friends&apos; Voice Notes
          </h3>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#9d174d] px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-200/90 font-semibold">
          {tracks.length} Real Audio Notes
        </span>
      </div>

      {/* Turntable Platter & Visualizer Stage */}
      <div className="w-full flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8] border border-pink-200 rounded-2xl p-5 shadow-sm">
        {/* Spinning Bubblegum Pink Vinyl Platter */}
        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-full border-4 border-pink-300 shadow-xl flex items-center justify-center relative overflow-hidden transition-all ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{
              animationDuration: "4s",
              backgroundImage:
                "radial-gradient(circle, #fbcfe8 0%, #f472b6 45%, #ec4899 70%, #db2777 100%)",
            }}
          >
            {/* Vinyl Grooves */}
            <div className="absolute inset-2 rounded-full border border-white/30" />
            <div className="absolute inset-5 rounded-full border border-white/30" />
            <div className="absolute inset-8 rounded-full border border-white/30" />

            {/* Center Label */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shadow-md">
              <Disc size={20} weight="fill" />
            </div>
            {/* Center Spindle Hole (Deep wine berry, zero black) */}
            <div className="absolute w-2 h-2 rounded-full bg-[#831843] border border-white/40" />
          </div>

          {/* Tone Arm Simulation */}
          <div
            className={`absolute top-0 right-1 w-2 h-16 origin-top bg-gradient-to-b from-rose-400 to-pink-600 rounded-full transition-transform duration-500 shadow-sm ${
              isPlaying ? "rotate-20" : "-rotate-12"
            }`}
          />
        </div>

        {/* Current Track Info & Visualizer */}
        <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/90 text-[#9d174d] border border-pink-200 font-semibold shadow-xs">
              {currentTrack.tag}
            </span>
            <span className="text-xs text-[#9d174d] font-medium">{currentTrack.artist}</span>
          </div>

          <h4 className="text-lg font-bold text-[#831843] tracking-tight truncate mb-1">
            {currentTrack.title}
          </h4>

          {currentTrack.notes && (
            <p className="text-xs text-[#9d174d]/85 line-clamp-1 mb-3 font-medium">
              {currentTrack.notes}
            </p>
          )}

          {/* Audio Visualizer Bars in Radiant Pink */}
          <div className="flex items-end gap-1.5 h-7 mb-3">
            {[40, 75, 55, 90, 65, 80, 45, 95, 70, 50, 85, 60].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-pink-500 to-rose-400 transition-all duration-150 ${
                  isPlaying ? "animate-pulse" : "opacity-40"
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * ((i % 3) + 1)) % 100)}%` : "20%",
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>

          {/* Scrubber Progress Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#9d174d] font-semibold w-8 text-right">
              {formatTime(progressSec)}
            </span>
            <div
              onClick={handleScrub}
              className="flex-1 h-2 bg-pink-200/90 hover:h-2.5 rounded-full cursor-pointer relative transition-all group/scrubber overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full relative transition-all duration-150"
                style={{ width: `${Math.min(100, (progressSec / totalDurationSec) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#9d174d] font-semibold w-8">
              {currentTrack.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Main Transport Controls (Mute button removed as requested) */}
      <div className="flex items-center justify-center border-t border-pink-200/80 pt-4">
        <div className="flex items-center gap-3">
          {/* Previous Track */}
          <button
            onClick={prevTrack}
            aria-label="Previous voice note"
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-[#831843] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <SkipBack size={19} weight="bold" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
            className="w-13 h-13 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(236,72,153,0.35)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer font-bold"
          >
            {isPlaying ? (
              <Pause size={24} weight="bold" />
            ) : (
              <Play size={24} weight="fill" className="ml-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            aria-label="Next voice note"
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-[#831843] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <SkipForward size={19} weight="bold" />
          </button>
        </div>
      </div>

      {/* Voice Notes List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#831843]">Select Voice Note</span>
          <span className="text-[10px] font-mono text-[#9d174d] font-semibold">
            Tap any note to listen
          </span>
        </div>

        {/* List of 4 Real Audio Voice Notes */}
        <div className="flex flex-col gap-1.5">
          {tracks.map((item) => {
            const isSelected = item.id === currentTrack.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  const idx = tracks.findIndex((t) => t.id === item.id);
                  if (idx !== -1) {
                    setCurrentTrackIndex(idx);
                    setProgressSec(0);
                    if (!isPlaying) {
                      setActiveAudioSource("jukebox");
                    }
                  }
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-pink-100/90 border-pink-300 text-[#831843] font-semibold shadow-xs"
                    : "bg-pink-50/50 border-pink-100 text-[#9d174d] hover:bg-pink-100/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    <Microphone size={14} weight="bold" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <p className="text-xs font-bold text-[#831843] truncate">{item.title}</p>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-2xs flex-shrink-0">
                        Real Audio
                      </span>
                    </div>
                    <p className="text-[10px] text-[#9d174d] truncate">{item.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-mono text-[#9d174d] font-semibold">
                    {item.duration}
                  </span>
                  {isSelected && isPlaying && (
                    <Sparkle size={13} weight="fill" className="text-pink-500 animate-spin" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
