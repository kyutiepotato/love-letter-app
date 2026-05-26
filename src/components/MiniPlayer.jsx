import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';

export default function MiniPlayer() {
  const { isPlaying, toggle, next, prev, currentTrack, showMiniPlayer } = useMusic();

  if (!showMiniPlayer) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', damping: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-strong rounded-full px-5 py-3 flex items-center gap-4 shadow-2xl"
        style={{ boxShadow: '0 8px 40px rgba(255,100,140,0.25), 0 0 0 1px rgba(255,183,197,0.2)' }}>
        
        {/* Disc */}
        <div className="relative w-9 h-9 flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-full border-2 border-sakura/40 flex items-center justify-center ${isPlaying ? 'disc-spinning' : 'disc-paused'}`}
            style={{
              background: `conic-gradient(from 0deg, ${currentTrack.color}88, #1a0a0f, ${currentTrack.color}44, #1a0a0f)`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ['0 0 8px rgba(255,183,197,0.4)', '0 0 20px rgba(255,183,197,0.8)', '0 0 8px rgba(255,183,197,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Track info */}
        <div className="flex flex-col min-w-0 max-w-[140px]">
          <span className="text-white/90 text-xs font-serif truncate">{currentTrack.title}</span>
          <span className="text-white/50 text-[10px] truncate">{currentTrack.artist}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={prev} className="text-white/60 hover:text-sakura transition-colors p-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ background: 'rgba(255,183,197,0.25)', border: '1px solid rgba(255,183,197,0.4)' }}
          >
            {isPlaying ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          <button onClick={next} className="text-white/60 hover:text-sakura transition-colors p-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm2.5-6l-2.5-3.47V15.47L8.5 12zM16 6h2v12h-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
