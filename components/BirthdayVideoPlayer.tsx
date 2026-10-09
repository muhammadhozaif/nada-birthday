"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  ArrowsOut,
  ArrowsIn,
  FilmStrip,
  Sparkle,
  ArrowCounterClockwise,
  Repeat,
} from "@phosphor-icons/react";
import { celebrationConfig } from "@/config/celebration.config";

export function BirthdayVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleLoop = () => {
    setIsLooping((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.loop = next;
      }
      return next;
    });
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Autoplay on mount when celebration unlocks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      setCurrentTime(cur);
      if (dur > 0) {
        setProgress((cur / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (!isLooping) {
      setIsPlaying(false);
    }
  };

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * (videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    setProgress(percentage * 100);
    setCurrentTime(newTime);
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Double-Bezel Outer Shell */}
      <div className="relative w-full rounded-[2rem] bg-pink-100/75 border border-pink-200/90 p-3 sm:p-4 shadow-[0_16px_40px_rgba(236,72,153,0.12)] flex flex-col gap-3.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
              <FilmStrip size={17} weight="duotone" />
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-[#831843] truncate">
                {celebrationConfig.video.title}
              </h2>
              <p className="text-[11px] text-[#9d174d] truncate font-medium">
                Birthday Animation Reel for Nada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9d174d] px-2.5 py-0.5 rounded-full bg-pink-200/70 border border-pink-300/80 font-bold flex items-center gap-1 shadow-2xs">
              <Sparkle size={12} weight="fill" className="text-pink-600" />
              <span>HD Reel</span>
            </span>
            <button
              onClick={toggleLoop}
              aria-label={isLooping ? "Looping enabled" : "Looping disabled"}
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                isLooping
                  ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                  : "bg-white/80 text-[#9d174d] border-pink-200/90 hover:bg-pink-100"
              }`}
            >
              <Repeat size={12} weight="bold" />
              <span className="hidden sm:inline">{isLooping ? "Loop On" : "Loop Off"}</span>
            </button>
          </div>
        </div>

        {/* Inner Video Core Screen */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video rounded-[calc(2rem-0.625rem)] overflow-hidden bg-[#3b0724] border border-pink-200/90 shadow-inner group select-none flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={celebrationConfig.video.videoUrl}
            poster={celebrationConfig.video.posterImage}
            playsInline
            autoPlay
            muted
            loop={isLooping}
            className="w-full h-full object-contain block mx-auto transition-transform duration-300"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
          />

          {/* Center Tactile Play Button (When Paused) */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              aria-label="Play video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 hover:from-pink-600 hover:to-rose-600 text-white flex items-center justify-center shadow-[0_10px_35px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
            >
              <Play size={28} weight="fill" className="ml-1 text-white" />
            </button>
          )}

          {/* Overlay Scrim & Controls (Deep berry wine gradient, NO black) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/90 via-[#831843]/20 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 z-10 pointer-events-none">
            {/* Interactive Progress Scrubber */}
            <div
              ref={progressBarRef}
              onClick={handleScrub}
              className="w-full h-2 bg-white/30 hover:h-2.5 rounded-full mb-3 cursor-pointer relative transition-all group/scrubber pointer-events-auto"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-300 via-rose-300 to-pink-200 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-pink-400 group-hover/scrubber:scale-125 transition-transform" />
              </div>
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white pointer-events-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause reel" : "Play reel"}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#831843] hover:bg-pink-100 flex items-center justify-center transition-all cursor-pointer font-bold shadow-md hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause size={17} weight="bold" />
                  ) : (
                    <Play size={17} weight="fill" className="ml-0.5" />
                  )}
                </button>

                {/* Restart */}
                <button
                  onClick={restartVideo}
                  aria-label="Replay from start"
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ArrowCounterClockwise size={16} weight="bold" />
                </button>

                {/* Loop Toggle */}
                <button
                  onClick={toggleLoop}
                  aria-label={isLooping ? "Loop enabled" : "Loop disabled"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    isLooping ? "bg-pink-500 text-white shadow-xs" : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  <Repeat size={16} weight="bold" />
                </button>

                {/* Time Display */}
                <span className="text-[11px] font-mono tracking-wider text-pink-100 font-semibold pl-1">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  {isFullscreen ? (
                    <ArrowsIn size={17} weight="bold" />
                  ) : (
                    <ArrowsOut size={17} weight="bold" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Details */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#9d174d]">
          <p className="font-medium leading-relaxed">
            {celebrationConfig.video.description}
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={restartVideo}
              className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#831843] border border-pink-200/90 font-bold text-[11px] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <ArrowCounterClockwise size={13} weight="bold" />
              <span>Replay</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-[11px] transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <ArrowsOut size={13} weight="bold" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
