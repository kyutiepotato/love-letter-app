import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import PageLayout from '../components/PageLayout';

function WaveformVisualizer({ isPlaying }) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: 'rgba(255,183,197,0.6)' }}
          animate={isPlaying ? {
            height: [4, 8 + Math.sin(i * 0.7) * 12, 4],
            opacity: [0.4, 1, 0.4],
          } : { height: 3, opacity: 0.3 }}
          transition={{
            duration: 0.8 + (i % 5) * 0.1,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function MusicPage() {
  const {
    isPlaying, toggle, next, prev,
    currentIdx, setCurrentIdx,
    progress, setProgress,
    volume, setVolume,
    playlist, currentTrack,
  } = useMusic();

  return (
    <PageLayout title="Our Soundtrack" subtitle="Every song, a memory">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Main player card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,240,245,0.07)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,183,197,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,183,197,0.1)',
          }}
        >
          {/* Album art area */}
          <div className="relative p-8 pb-4 flex justify-center">
            {/* Background glow */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: isPlaying
                  ? [`radial-gradient(circle at 50% 50%, ${currentTrack.color}22 0%, transparent 70%)`]
                  : ['radial-gradient(circle at 50% 50%, transparent 0%, transparent 70%)'],
              }}
              transition={{ duration: 1 }}
            />

            {/* Rotating disc */}
            <div className="relative">
              <motion.div
                className={`w-44 h-44 rounded-full relative overflow-hidden ${isPlaying ? 'disc-spinning' : 'disc-paused'}`}
                style={{
                  background: `conic-gradient(from 0deg, ${currentTrack.color}cc, #0a0305, ${currentTrack.color}66, #1a0810, ${currentTrack.color}aa, #0a0305, ${currentTrack.color}55, #0a0305)`,
                  boxShadow: isPlaying
                    ? `0 0 40px ${currentTrack.color}88, 0 20px 60px rgba(0,0,0,0.5)`
                    : '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                {/* Grooves */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border"
                    style={{
                      width: 40 + i * 22,
                      height: 40 + i * 22,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      borderColor: 'rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
                {/* Center */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: '#0a0305', border: '2px solid rgba(255,183,197,0.3)' }}
                >
                  <span className="text-2xl">🎵</span>
                </div>
              </motion.div>

              {/* Glow ring */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  animate={{ boxShadow: [`0 0 20px ${currentTrack.color}44`, `0 0 60px ${currentTrack.color}88`, `0 0 20px ${currentTrack.color}44`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          {/* Track info */}
          <div className="px-6 pb-2 text-center">
            <h3 className="text-white text-xl font-serif">{currentTrack.title}</h3>
            <p className="text-white/40 text-sm mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>{currentTrack.artist}</p>
          </div>

          {/* Waveform */}
          <div className="px-6 py-2">
            <WaveformVisualizer isPlaying={isPlaying} />
          </div>

          {/* Progress */}
          <div className="px-6 pb-4">
            <div
              className="h-1 rounded-full cursor-pointer mb-2"
              style={{ background: 'rgba(255,183,197,0.15)' }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setProgress(Math.max(0, Math.min(100, pct)));
              }}
            >
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, ${currentTrack.color}, #ff6b99)`,
                }}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
                  style={{ boxShadow: `0 0 8px ${currentTrack.color}` }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between text-[10px] text-white/30" style={{ fontFamily: 'Lato, sans-serif' }}>
              <span>{Math.floor(progress / 100 * 265)} s</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-center gap-6">
              <button onClick={prev} className="text-white/50 hover:text-sakura transition-colors p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${currentTrack.color}cc, #ff6b99)`,
                  boxShadow: `0 8px 30px ${currentTrack.color}66`,
                }}
              >
                {isPlaying ? (
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </motion.button>

              <button onClick={next} className="text-white/50 hover:text-sakura transition-colors p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/>
                </svg>
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 mt-4">
              <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range" min="0" max="1" step="0.01"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: currentTrack.color }}
              />
              <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,240,245,0.05)',
            border: '1px solid rgba(255,183,197,0.15)',
          }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,183,197,0.1)' }}>
            <p className="text-white/50 text-xs tracking-widest uppercase" style={{ fontFamily: 'Lato, sans-serif' }}>
              Playlist · {playlist.length} songs
            </p>
          </div>
          {playlist.map((track, i) => (
            <motion.button
              key={track.id}
              onClick={() => setCurrentIdx(i)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left transition-all duration-200"
              style={{
                background: currentIdx === i ? 'rgba(255,183,197,0.1)' : 'transparent',
                borderBottom: '1px solid rgba(255,183,197,0.06)',
              }}
              whileHover={{ backgroundColor: 'rgba(255,183,197,0.08)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{
                  background: `${track.color}22`,
                  border: `1px solid ${track.color}44`,
                }}
              >
                {currentIdx === i && isPlaying ? '▶' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-serif truncate" style={{ color: currentIdx === i ? track.color : undefined }}>
                  {track.title}
                </p>
                <p className="text-white/30 text-xs truncate" style={{ fontFamily: 'Lato, sans-serif' }}>{track.artist}</p>
              </div>
              <span className="text-white/25 text-xs flex-shrink-0" style={{ fontFamily: 'Lato, sans-serif' }}>{track.duration}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
