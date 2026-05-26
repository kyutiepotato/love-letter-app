import { motion } from 'framer-motion';

// Replace this with your image path, e.g. '/src/assets/your-photo.jpg'
const BG_IMAGE = '/src/assets/bg.png';

export default function CinematicBackground({ intensity = 0.85 }) {
  return (
    <div className="fixed inset-0 z-0">

      {/* ── YOUR PHOTO ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark overlay so text stays readable — raise the last number (0–1) to darken more */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(8, 2, 5, 0.55)' }}
      />

      {/* Romantic color tint on top of photo */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(74,16,32,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 70% 60%, rgba(45,10,24,0.35) 0%, transparent 55%)
          `,
        }}
      />

      {/* Warm light bloom */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 40% 60% at 50% 35%, rgba(255,150,100,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 50% 40%, rgba(255,183,197,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Cinematic vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgba(0,0,0,0.75) 100%)`,
        }}
      />

      {/* Subtle warm bokeh lights */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: `radial-gradient(circle, rgba(255,${100 + i * 15},${80 + i * 10},0.05) 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Film grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, rgba(10,3,5,0.9), transparent)' }}
      />
    </div>
  );
}