import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const bgMusicRef = useRef(null);
  const popSoundRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    bgMusicRef.current = new Audio('/music/Aankhon_Mein_Doob_Jaane_Ko.mp3');
    bgMusicRef.current.loop = true;

    popSoundRef.current = new Audio('/music/universfield-party-balloon-pop-323588.mp3');

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (popSoundRef.current) {
        popSoundRef.current = null;
      }
    };
  }, []);

  const startMusic = () => {
    if (!bgMusicRef.current) return;
    bgMusicRef.current.muted = false;
    if (popSoundRef.current) popSoundRef.current.muted = false;
    setIsMuted(false);
    bgMusicRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});
  };

  const toggleMute = () => {
    if (!bgMusicRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    bgMusicRef.current.muted = nextMuted;
    if (popSoundRef.current) popSoundRef.current.muted = nextMuted;

    if (!nextMuted) {
      bgMusicRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    } else {
      bgMusicRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playPop = () => {
    if (!popSoundRef.current || isMuted) return;
    try {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    } catch {}
  };

  return (
    <SoundContext.Provider value={{ isMuted, isPlaying, toggleMute, startMusic, playPop }}>
      {children}
      <button
        id="mute-btn"
        onClick={toggleMute}
        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        aria-label="Toggle sound"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
