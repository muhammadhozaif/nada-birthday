"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Microphone, MicrophoneSlash, Wind, ArrowCounterClockwise, Cake } from "@phosphor-icons/react";
import { celebrationConfig } from "@/config/celebration.config";
import { useCelebration } from "./CelebrationContext";
import { soundEffects } from "@/utils/audio-synth";
import { fireCandleExtinguishSparks } from "@/utils/confetti";

export function VirtualCake() {
  const { isCandlesBlown, setIsCandlesBlown, setShowWishModal, relightCandles } = useCelebration();
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const extinguishCandle = useCallback(
    (index: number) => {
      setCandlesLit((prev) => {
        const next = [...prev];
        next[index] = false;
        soundEffects.playCandleBlowPuff();

        // Check if all candles are blown
        if (next.every((lit) => !lit)) {
          setIsCandlesBlown(true);
          soundEffects.playCelebrationChime();
          fireCandleExtinguishSparks();
          setTimeout(() => {
            setShowWishModal(true);
          }, 800);
        }
        return next;
      });
    },
    [setIsCandlesBlown, setShowWishModal]
  );

  const extinguishAllCandles = useCallback(() => {
    setCandlesLit(new Array(celebrationConfig.cake.candleCount).fill(false));
    soundEffects.playCandleBlowPuff();
    soundEffects.playCelebrationChime();
    fireCandleExtinguishSparks();
    setIsCandlesBlown(true);
    setTimeout(() => {
      setShowWishModal(true);
    }, 800);
  }, [setIsCandlesBlown, setShowWishModal]);

  // Clean up microphone stream
  const stopMicrophone = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicListening(false);
    setMicVolume(0);
  }, []);

  // Start microphone breath detection
  const startMicrophone = useCallback(async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMicListening(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlowing = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average energy in high-frequency air puff range
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength / 255;
        setMicVolume(Math.min(1, average * 3));

        // Detect breath threshold
        if (average > celebrationConfig.cake.blowSensitivityThreshold) {
          extinguishAllCandles();
          stopMicrophone();
          return;
        }

        animFrameRef.current = requestAnimationFrame(checkBlowing);
      };

      checkBlowing();
    } catch {
      setMicError("Mic access was not permitted. You can tap to blow.");
      setIsMicListening(false);
    }
  }, [extinguishAllCandles, stopMicrophone]);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return (
    <div className="w-full flex flex-col items-center gap-4 bg-white/85 border border-pink-200/90 rounded-2xl p-6 relative overflow-hidden shadow-[0_12px_35px_rgba(236,72,153,0.12)]">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Cake size={20} weight="duotone" className="text-pink-600" />
            <h3 className="text-base font-bold text-[#831843] tracking-tight">Birthday Queen Cake</h3>
          </div>
          <p className="text-xs text-[#9d174d] mt-0.5">{celebrationConfig.cake.flavor}</p>
        </div>

        <span className="text-[11px] font-mono uppercase tracking-wider text-[#9d174d] px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-200/90 font-semibold">
          {isCandlesBlown ? "Wishes Made" : "Ready to Blow"}
        </span>
      </div>

      {/* Digital Cake Stage in Girly Pink */}
      <div className="relative w-full max-w-xs h-64 flex flex-col items-center justify-end select-none my-2">
        {/* Candles Row */}
        <div className="flex items-end justify-center gap-8 mb-[-6px] z-10">
          {candlesLit.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => isLit && extinguishCandle(idx)}
              className="flex flex-col items-center cursor-pointer group"
              title={isLit ? "Click or tap to blow candle" : "Extinguished"}
            >
              {/* Flame or Smoke */}
              <div className="h-10 flex items-center justify-center relative">
                {isLit ? (
                  <div className="relative">
                    {/* Glowing outer pink halo */}
                    <div className="absolute -inset-2 bg-pink-400/40 rounded-full blur-md animate-pulse" />
                    {/* Candle Flame */}
                    <div className="w-4 h-7 rounded-[50%_50%_40%_40%] bg-gradient-to-t from-rose-500 via-pink-400 to-amber-200 shadow-[0_0_14px_#fb7185] animate-bounce duration-300 group-hover:scale-110 transition-transform" />
                  </div>
                ) : (
                  /* Rising smoke particles */
                  <div className="relative flex flex-col items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400/50 animate-ping" />
                    <span className="w-1 h-3 rounded-full bg-pink-300/40 mt-1 blur-[1px]" />
                  </div>
                )}
              </div>

              {/* Candle Wick (Deep Berry Rose, zero black) */}
              <div className="w-0.5 h-2 bg-[#831843] -mb-0.5" />

              {/* Candle Body (Pastel Pink & White Candy Stripe) */}
              <div className="w-3.5 h-12 rounded-t-sm bg-gradient-to-r from-pink-100 via-white to-pink-200 shadow-sm border border-pink-300/60 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,#f43f5e,#f43f5e_4px,transparent_4px,transparent_8px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Top Cake Tier (Strawberry Cream) */}
        <div className="relative w-44 h-14 rounded-t-xl bg-gradient-to-b from-[#fce7f3] to-[#fbcfe8] border-t-2 border-x border-pink-300 flex items-center justify-center shadow-sm">
          {/* Frosting dripping scallops */}
          <div className="absolute -top-1 inset-x-2 flex justify-between">
            <span className="w-4 h-3 rounded-full bg-white shadow-sm" />
            <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            <span className="w-4 h-3 rounded-full bg-white shadow-sm" />
            <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            <span className="w-4 h-3 rounded-full bg-white shadow-sm" />
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#831843] font-bold">
            Make A Wish
          </span>
        </div>

        {/* Base Cake Tier (Rose Quartz Cream) */}
        <div className="relative w-64 h-20 rounded-t-xl bg-gradient-to-b from-[#fbcfe8] to-[#f472b6]/35 border-t-2 border-x border-pink-300 flex items-center justify-center shadow-md">
          {/* Frosting rosettes */}
          <div className="absolute -top-1.5 inset-x-3 flex justify-around">
            <span className="w-5 h-4 rounded-full bg-white shadow-sm" />
            <span className="w-5 h-4 rounded-full bg-white shadow-sm" />
            <span className="w-5 h-4 rounded-full bg-white shadow-sm" />
            <span className="w-5 h-4 rounded-full bg-white shadow-sm" />
            <span className="w-5 h-4 rounded-full bg-white shadow-sm" />
          </div>

          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
          </div>
        </div>

        {/* Pedestal Plate (Shimmering Pearl Rose) */}
        <div className="w-72 h-4 rounded-full bg-gradient-to-r from-pink-200 via-white to-pink-200 shadow-md border border-pink-300/60" />
      </div>

      {/* Action Controls */}
      <div className="w-full flex flex-col items-center gap-3 mt-2">
        {isCandlesBlown ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWishModal(true)}
              className="h-10 px-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              Read Secret Wish Note
            </button>
            <button
              onClick={relightCandles}
              className="h-10 px-4 rounded-full border border-pink-200 bg-pink-50 hover:bg-pink-100 text-[#831843] transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <ArrowCounterClockwise size={16} weight="bold" />
              <span>Relight Candles</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Mic Blowing Detection Button */}
              <button
                onClick={isMicListening ? stopMicrophone : startMicrophone}
                className={`h-10 px-4 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isMicListening
                    ? "bg-rose-100 border-rose-300 text-rose-600 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                    : "bg-pink-50 border-pink-200 text-[#831843] hover:bg-pink-100"
                }`}
              >
                {isMicListening ? (
                  <>
                    <Microphone size={16} weight="fill" className="text-rose-500" />
                    <span>Listening for Blow...</span>
                  </>
                ) : (
                  <>
                    <Microphone size={16} weight="bold" className="text-pink-600" />
                    <span>Blow with Mic</span>
                  </>
                )}
              </button>

              {/* Tap to Blow Button */}
              <button
                onClick={extinguishAllCandles}
                className="h-10 px-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <Wind size={16} weight="bold" className="text-pink-100" />
                <span>Blow All Candles</span>
              </button>
            </div>

            {/* Mic Breath Feedback Bar */}
            {isMicListening && (
              <div className="w-48 flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-[#9d174d]">Puff Level</span>
                <div className="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-75"
                    style={{ width: `${Math.round(micVolume * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {micError && (
              <p className="text-[11px] text-[#be185d] flex items-center gap-1.5 mt-1">
                <MicrophoneSlash size={14} className="text-rose-500" />
                {micError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
