import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';

// ── ADD YOUR PHOTOS HERE ─────────────────────────────────────────────────────
// For each memory, set `image` to the path of your photo inside src/assets/
// If you leave `image` as null, it will show the emoji instead (safe fallback)
// Example: image: '/src/assets/gallery/first-date.jpg',
// ─────────────────────────────────────────────────────────────────────────────

const MEMORIES = [
  { id: 1, title: "First Date",        date: "Feb 14, 2025", caption: "The night everything changed",    emoji: "🌹", color: "#ff6b99", hue: 340, image: '/src/assets/gallery/photo1.jpg'  },
  { id: 2, title: "Beach Sunset",      date: "Apr 3, 2025",  caption: "Salt air and your laughter",      emoji: "🌅", color: "#f97316", hue: 20,  image: '/src/assets/gallery/photo3.jpg' },
  { id: 3, title: "Morning Coffee",    date: "May 20, 2025", caption: "Our lazy Sunday ritual",           emoji: "☕", color: "#fbbf24", hue: 45,  image: '/src/assets/gallery/photo4.jpg' },
  { id: 4, title: "Stargazing",        date: "Jul 4, 2025",  caption: "You named a star after us",        emoji: "⭐", color: "#818cf8", hue: 240, image: '/src/assets/gallery/stargazing.jpg' },
  { id: 5, title: "Rain Dance",        date: "Aug 15, 2025", caption: "We got soaked and didn't care",    emoji: "🌧️", color: "#60a5fa", hue: 210, image: '/src/assets/gallery/rain-dance.jpg' },
  { id: 6, title: "First Anniversary", date: "Feb 14, 2025", caption: "A whole year of loving you",       emoji: "💕", color: "#f43f5e", hue: 350, image: '/src/assets/gallery/first-anniversary.jpg' },
  { id: 7, title: "Road Trip",         date: "Jun 10, 2025", caption: "Just us and the open road",        emoji: "🚗", color: "#34d399", hue: 160, image: '/src/assets/gallery/road-trip.jpg' },
  { id: 8, title: "Winter Walk",       date: "Dec 25, 2025", caption: "Your hand warm in the cold",       emoji: "❄️", color: "#93c5fd", hue: 210, image: '/src/assets/gallery/winter-walk.jpg' },
  { id: 9, title: "Home",              date: "Mar 1, 2026",  caption: "Wherever you are is home",         emoji: "🏠", color: "#fda4af", hue: 350, image: '/src/assets/gallery/home.jpg' },
];

// Reusable photo area used in both the card thumbnail and the lightbox
function PhotoArea({ memory, height, emojiSize = '5xl', children }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
        background: memory.image
          ? undefined
          : `radial-gradient(ellipse 70% 80% at 40% 50%,
              hsl(${memory.hue}, 50%, 25%) 0%,
              hsl(${memory.hue + 20}, 30%, 12%) 60%,
              hsl(${memory.hue - 20}, 20%, 8%) 100%)`,
      }}
    >
      {memory.image ? (
        /* ── Real photo ── */
        <>
          <img
            src={memory.image}
            alt={memory.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Soft dark gradient so caption text stays readable */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }}
          />
        </>
      ) : (
        /* ── Emoji placeholder ── */
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 20 + i * 12,
                height: 20 + i * 12,
                left: `${10 + i * 18}%`,
                top: `${20 + (i % 2) * 40}%`,
                background: `radial-gradient(circle, hsla(${memory.hue}, 80%, 70%, 0.15) 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-${emojiSize} filter drop-shadow-lg opacity-80`}>{memory.emoji}</span>
          </div>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
          />
        </>
      )}

      {/* Hover glow (works on both photo and emoji) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ background: `radial-gradient(circle at center, ${memory.color}22 0%, transparent 70%)` }}
      />

      {/* Extra content (e.g. close button slot) */}
      {children}
    </div>
  );
}

function MemoryCard({ memory, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: (index % 3 - 1) * 2 }}
      animate={{ opacity: 1, y: 0, rotate: (index % 3 - 1) * 1.5 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
      onClick={() => onClick(memory)}
      className="cursor-pointer relative group"
    >
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: 'rgba(15, 5, 8, 0.8)',
          border: '1px solid rgba(255,183,197,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Film strip holes top */}
        <div className="flex gap-2 px-2 py-1.5 justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,183,197,0.12)' }} />
          ))}
        </div>

        {/* Thumbnail photo */}
        <div className="mx-2">
          <PhotoArea memory={memory} height={140} emojiSize="5xl" />
        </div>

        {/* Film strip holes bottom */}
        <div className="flex gap-2 px-2 py-1.5 justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,183,197,0.12)' }} />
          ))}
        </div>

        {/* Caption */}
        <div className="px-3 pb-3 pt-1">
          <p className="text-white/80 text-xs font-serif">{memory.title}</p>
          <p className="text-white/35 text-[10px]" style={{ fontFamily: 'Lato, sans-serif' }}>{memory.date}</p>
        </div>
      </div>
    </motion.div>
  );
}

function LightboxModal({ memory, onClose }) {
  if (!memory) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        className="relative max-w-sm w-full z-10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15,5,8,0.95)',
            border: '1px solid rgba(255,183,197,0.3)',
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 40px ${memory.color}33`,
          }}
        >
          {/* Full-size photo */}
          <PhotoArea memory={memory} height={280} emojiSize="8xl" />

          {/* Info */}
          <div className="p-6">
            <h3 className="text-2xl font-serif italic text-white mb-1">{memory.title}</h3>
            <p className="text-white/40 text-sm mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>{memory.date}</p>
            <p className="text-white/70 text-base italic" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              "{memory.caption}"
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const years = ['all', '2025', '2026'];
  const filtered = filter === 'all' ? MEMORIES : MEMORIES.filter(m => m.date.includes(filter));

  return (
    <PageLayout title="Our Gallery" subtitle="Every frame holds forever">
      {/* Year filter */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {years.map(y => (
          <button
            key={y}
            onClick={() => setFilter(y)}
            className="px-4 py-1.5 rounded-full text-sm transition-all duration-300"
            style={{
              background: filter === y ? 'rgba(255,183,197,0.25)' : 'rgba(255,240,245,0.06)',
              border: `1px solid ${filter === y ? 'rgba(255,183,197,0.5)' : 'rgba(255,183,197,0.15)'}`,
              color: filter === y ? '#ffb7c5' : 'rgba(255,240,245,0.5)',
              fontFamily: 'Lato, sans-serif',
            }}
          >
            {y === 'all' ? 'All Memories' : y}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-4" layout>
        <AnimatePresence>
          {filtered.map((memory, i) => (
            <MemoryCard key={memory.id} memory={memory} index={i} onClick={setSelected} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && <LightboxModal memory={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </PageLayout>
  );
}