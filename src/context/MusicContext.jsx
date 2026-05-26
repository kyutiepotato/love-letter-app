import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext(null);

const PLAYLIST = [
  {
    id: 1,
    title: "A Thousand Years",
    artist: "Christina Perri",
    duration: "4:45",
    color: "#ffb7c5",
    // Using a royalty-free ambient track via tone generation (we'll generate with Web Audio)
    src: null,
  },
  {
    id: 2,
    title: "All of Me",
    artist: "John Legend",
    duration: "4:29",
    color: "#fda4af",
    src: null,
  },
  {
    id: 3,
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: "4:23",
    color: "#ffc8d9",
    src: null,
  },
  {
    id: 4,
    title: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    duration: "3:01",
    color: "#ffe0e9",
    src: null,
  },
];

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const intervalRef = useRef(null);
  const progressRef = useRef(0);

  // Generate ambient romantic tone using Web Audio API
  const startAmbientMusic = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    gainNodeRef.current.gain.setTargetAtTime(volume * 0.15, ctx.currentTime, 0.3);

    // Stop existing
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
    oscillatorsRef.current = [];

    // Romantic chord: F major-ish ambient
    const baseFreqs = [174.6, 220, 261.6, 329.6, 392];
    baseFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      // Slow gentle vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1 + i * 0.05;
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      gain.gain.value = 0.03 / (i + 1);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(gainNodeRef.current);
      osc.start();
      oscillatorsRef.current.push(osc, lfo);
    });
  }, [volume]);

  const stopAmbientMusic = useCallback(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      setTimeout(() => {
        oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
        oscillatorsRef.current = [];
      }, 600);
    }
  }, []);

  const play = useCallback(() => {
    startAmbientMusic();
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      progressRef.current = (progressRef.current + 0.1) % 100;
      setProgress(progressRef.current);
    }, 270);
  }, [startAmbientMusic]);

  const pause = useCallback(() => {
    stopAmbientMusic();
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  }, [stopAmbientMusic]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    setCurrentIdx(i => (i + 1) % PLAYLIST.length);
    progressRef.current = 0;
    setProgress(0);
    if (isPlaying) { stopAmbientMusic(); setTimeout(startAmbientMusic, 100); }
  }, [isPlaying, stopAmbientMusic, startAmbientMusic]);

  const prev = useCallback(() => {
    setCurrentIdx(i => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
    progressRef.current = 0;
    setProgress(0);
    if (isPlaying) { stopAmbientMusic(); setTimeout(startAmbientMusic, 100); }
  }, [isPlaying, stopAmbientMusic, startAmbientMusic]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume * 0.15, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  return (
    <MusicContext.Provider value={{
      isPlaying, toggle, play, pause, next, prev,
      currentIdx, setCurrentIdx,
      progress, setProgress,
      volume, setVolume,
      playlist: PLAYLIST,
      currentTrack: PLAYLIST[currentIdx],
      showMiniPlayer, setShowMiniPlayer,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
