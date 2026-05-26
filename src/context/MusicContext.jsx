import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const MusicContext = createContext(null);

const PLAYLIST = [
  {
    id: 1,
    title: "Ginintuang Tanawin",
    artist: "Wilbert Ross",
    duration: "4:45",
    color: "#ffb7c5",
    src: "/src/assets/music/ginintuang-tanawin-official-music-video.mp3",
  },
  {
    id: 2,
    title: "Nahanap Kita",
    artist: "Amiel Sol",
    duration: "4:29",
    color: "#fda4af",
    src: "/src/assets/music/Nahanap Kita - Amiel Sol (Official Music Video).mp3", 
  },
  {
    id: 3,
    title: "You",
    artist: "Lany",
    duration: "4:23",
    color: "#ffc8d9",
    src: "/src/assets/music/LANY - you! (Lyrics).mp3",
  },
  {
    id: 4,
    title: "Your Universe",
    artist: "Rico Blanco (Acoustic)",
    duration: "3:01",
    color: "#ffe0e9",
    src: "/src/assets/music/your-universe-acoustic.mp3",
  },
  {
    id: 4,
    title: "Balisong",
    artist: "Rico Blanco (Acoustic)",
    duration: "3:01",
    color: "#ffe0e9",
    src: null,
  },
  {
    id: 4,
    title: "Your Universe",
    artist: "Bradley",
    duration: "3:01",
    color: "#ffe0e9",
    src: "/src/assets/music/PERFECT FOR ME - BRADLEY MARSHALL (LYRIC VIDEO).mp3",
  },
];

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);

  const audioRef = useRef(null); // the real <audio> element

  const currentTrack = PLAYLIST[currentIdx];

  // --- Helpers ---

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      // Update progress bar as song plays
      audioRef.current.addEventListener('timeupdate', () => {
        const a = audioRef.current;
        if (a && a.duration) {
          setProgress((a.currentTime / a.duration) * 100);
        }
      });

      // Auto-advance to next track when song ends
      audioRef.current.addEventListener('ended', () => {
        setCurrentIdx(i => (i + 1) % PLAYLIST.length);
      });
    }
    return audioRef.current;
  }, [volume]);

  // Load a new track whenever currentIdx changes
  useEffect(() => {
    const audio = getAudio();
    const track = PLAYLIST[currentIdx];

    if (track.src) {
      audio.src = track.src;
      audio.load();
      setProgress(0);
      if (isPlaying) {
        audio.play().catch(err => console.warn('Playback error:', err));
      }
    } else {
      // No audio file — just reset progress
      audio.src = '';
      setProgress(0);
    }
  }, [currentIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume whenever it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // --- Controls ---

  const play = useCallback(() => {
    const audio = getAudio();
    const track = PLAYLIST[currentIdx];
    if (track.src) {
      audio.play().catch(err => console.warn('Playback error:', err));
    }
    setIsPlaying(true);
  }, [currentIdx, getAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setProgress(0);
    setCurrentIdx(i => (i + 1) % PLAYLIST.length);
    // isPlaying will resume in the useEffect above after src loads
    setIsPlaying(true);
  }, []);

  const prev = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setProgress(0);
    setCurrentIdx(i => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  }, []);

  // Seek: call this with a 0–100 value
  const seek = useCallback((pct) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
      setProgress(pct);
    }
  }, []);

  return (
    <MusicContext.Provider value={{
      isPlaying, toggle, play, pause, next, prev,
      currentIdx, setCurrentIdx,
      progress, setProgress,
      seek,
      volume, setVolume,
      playlist: PLAYLIST,
      currentTrack,
      showMiniPlayer, setShowMiniPlayer,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);