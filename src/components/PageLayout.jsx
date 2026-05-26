import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PageLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen px-4 py-6 sm:py-10 relative z-20 pb-28"
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate('/')}
        className="mb-6 sm:mb-8 flex items-center gap-2 text-white/40 hover:text-sakura transition-colors group"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.span
          className="text-lg"
          animate={{ x: 0 }}
          whileHover={{ x: -2 }}
        >
          ←
        </motion.span>
        <span className="text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>Back Home</span>
      </motion.button>

      {/* Page title */}
      <motion.div
        className="text-center mb-8 sm:mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Decorative */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10 sm:w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(255,183,197,0.5))' }} />
          <div className="w-1 h-1 rounded-full bg-sakura/60" />
          <div className="h-px w-10 sm:w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(255,183,197,0.5))' }} />
        </div>

        <h1
          className="text-3xl sm:text-4xl font-serif italic"
          style={{
            background: 'linear-gradient(135deg, #fff0f3 0%, #ffb7c5 50%, #ffd0dd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(255,183,197,0.3))',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-white/35 text-sm mt-2 italic"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
