import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MENU_ITEMS = [
  {
    id: 'puzzle',
    path: '/puzzle',
    icon: '🧩',
    title: 'Put Us Together',
    subtitle: 'Piece by piece, heart by heart',
    color: '#ff6b99',
    glow: 'rgba(255,107,153,0.4)',
    delay: 0.1,
  },
  {
    id: 'gallery',
    path: '/gallery',
    icon: '📸',
    title: 'Our Gallery',
    subtitle: 'Every frame, a forever memory',
    color: '#f9a8c9',
    glow: 'rgba(249,168,201,0.4)',
    delay: 0.2,
  },
  {
    id: 'music',
    path: '/music',
    icon: '🎵',
    title: 'Our Soundtrack',
    subtitle: 'Songs that hold our story',
    color: '#ffb7c5',
    glow: 'rgba(255,183,197,0.4)',
    delay: 0.3,
  },
  {
    id: 'notes',
    path: '/notes',
    icon: '💌',
    title: 'Love Notes',
    subtitle: 'Words I wrote just for you',
    color: '#fda4af',
    glow: 'rgba(253,164,175,0.4)',
    delay: 0.4,
  },
  {
    id: 'voice',
    path: '/voice',
    icon: '🎤',
    title: 'Voice Challenge',
    subtitle: 'Speak and reveal our secrets',
    color: '#fb7185',
    glow: 'rgba(251,113,133,0.4)',
    delay: 0.5,
  },
];

function MenuCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(item.path)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="cursor-pointer relative group"
    >
      {/* Glow behind card */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: item.glow, transform: 'scale(1.1) translateY(4px)' }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 transition-all duration-500"
        style={{
          background: hovered
            ? 'rgba(255, 240, 245, 0.14)'
            : 'rgba(255, 240, 245, 0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? 'rgba(255,183,197,0.45)' : 'rgba(255,183,197,0.18)'}`,
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
            : `0 8px 32px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Icon glow circle */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${item.glow} 0%, rgba(255,240,245,0.05) 100%)`,
            border: `1px solid ${item.color}44`,
            boxShadow: hovered ? `0 0 20px ${item.glow}` : 'none',
          }}
        >
          {item.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-serif text-lg sm:text-xl font-semibold transition-all duration-300"
            style={{
              color: hovered ? item.color : 'rgba(255,240,245,0.9)',
              textShadow: hovered ? `0 0 20px ${item.glow}` : 'none',
            }}
          >
            {item.title}
          </h3>
          <p className="text-white/40 text-sm mt-0.5 font-body" style={{ fontFamily: 'Lato, sans-serif' }}>
            {item.subtitle}
          </p>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
          style={{ color: item.color }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>

        {/* Shimmer */}
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite',
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative z-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12 sm:mb-16"
      >
        {/* Decorative line */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-px w-16 sm:w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(255,183,197,0.6))' }} />
          <span className="text-sakura text-lg">✦</span>
          <div className="h-px w-16 sm:w-24" style={{ background: 'linear-gradient(to left, transparent, rgba(255,183,197,0.6))' }} />
        </motion.div>

        <motion.p
          className="text-white/40 text-sm tracking-[0.4em] uppercase mb-3"
          style={{ fontFamily: 'Lato, sans-serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          A Love Story
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-serif italic"
          style={{
            background: 'linear-gradient(135deg, #fff0f3 0%, #ffb7c5 40%, #f9a8c9 70%, #ffd0dd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(255,183,197,0.4))',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          For You & Me
        </motion.h1>

        <motion.p
          className="text-white/35 text-base sm:text-lg mt-4 max-w-xs sm:max-w-sm mx-auto"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Every moment with you is a chapter I never want to close
        </motion.p>
      </motion.div>

      {/* Menu grid */}
      <div className="w-full max-w-md sm:max-w-lg space-y-3">
        {MENU_ITEMS.map(item => (
          <MenuCard key={item.id} item={item} onClick={navigate} />
        ))}
      </div>

      {/* Footer quote */}
      <motion.p
        className="mt-12 text-white/25 text-xs tracking-widest"
        style={{ fontFamily: 'Lato, sans-serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Made with love · Just for you
      </motion.p>
    </div>
  );
}
