"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { fireCelebrationCannons, fireSideCannons } from "@/utils/confetti";
import { soundEffects } from "@/utils/audio-synth";

type AudioSource = "none" | "theme-song" | "jukebox" | "video";

interface CelebrationContextType {
  isCelebrated: boolean;
  launchCelebration: () => void;
  activeAudioSource: AudioSource;
  setActiveAudioSource: (source: AudioSource) => void;
  isMuted: boolean;
  toggleMute: () => void;
  blastConfetti: () => void;
  isCandlesBlown: boolean;
  setIsCandlesBlown: (blown: boolean) => void;
  showWishModal: boolean;
  setShowWishModal: (show: boolean) => void;
  currentJukeboxTrackId: string | null;
  playJukeboxTrack: (trackId: string) => void;
  relightCandles: () => void;
  relightKey: number;
}

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [isCelebrated, setIsCelebrated] = useState(false);
  const [activeAudioSource, setActiveAudioSourceState] = useState<AudioSource>("none");
  const [isMuted, setIsMuted] = useState(false);
  const [isCandlesBlown, setIsCandlesBlown] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);
  const [relightKey, setRelightKey] = useState(0);
  const [currentJukeboxTrackId, setCurrentJukeboxTrackId] = useState<string | null>(null);

  const setActiveAudioSource = useCallback((source: AudioSource) => {
    setActiveAudioSourceState(source);
  }, []);

  const playJukeboxTrack = useCallback((trackId: string) => {
    setCurrentJukeboxTrackId(trackId);
    setActiveAudioSourceState("jukebox");
    soundEffects.playTactileClick();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const blastConfetti = useCallback(() => {
    soundEffects.playTactileClick();
    fireCelebrationCannons();
  }, []);

  const launchCelebration = useCallback(() => {
    setIsCelebrated(true);
    soundEffects.playCelebrationChime();
    fireCelebrationCannons();
    fireSideCannons(4000);
    setActiveAudioSourceState("none");
  }, []);

  const relightCandles = useCallback(() => {
    setIsCandlesBlown(false);
    setShowWishModal(false);
    setRelightKey((k) => k + 1);
    soundEffects.playTactileClick();
  }, []);

  return (
    <CelebrationContext.Provider
      value={{
        isCelebrated,
        launchCelebration,
        activeAudioSource,
        setActiveAudioSource,
        isMuted,
        toggleMute,
        blastConfetti,
        isCandlesBlown,
        setIsCandlesBlown,
        showWishModal,
        setShowWishModal,
        currentJukeboxTrackId,
        playJukeboxTrack,
        relightCandles,
        relightKey,
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext);
  if (!ctx) {
    throw new Error("useCelebration must be used within CelebrationProvider");
  }
  return ctx;
}
