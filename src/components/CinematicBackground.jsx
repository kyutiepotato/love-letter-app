import { motion } from 'framer-motion';

// Romantic background using CSS gradient art (since we don't have real photos)
export default function CinematicBackground({ intensity = 0.85 }) {
  return (
    <div className="fixed inset-0 z-0">
      {/* Base romantic scene - gradient painting */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, #4a1020 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 70% 60%, #2d0a18 0%, transparent 55%),
            radial-gradient(ellipse 100% 50% at 50% 80%, #1a0510 0%, transparent 50%),
            linear-gradient(135deg, #0d0208 0%, #2a0d18 30%, #1a0810 60%, #0a0305 100%)
          `,
        }}
      />
      
      {/* Warm light bloom - simulating backlit couple silhouette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 40% 60% at 50% 35%, rgba(255,150,100,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 50% 40%, rgba(255,183,197,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgba(0,0,0,0.7) 100%)`,
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
            background: `radial-gradient(circle, rgba(255,${100 + i * 15},${80 + i * 10},0.06) 0%, transparent 70%)`,
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
        className="absolute inset-0 opacity-[0.03]"
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
