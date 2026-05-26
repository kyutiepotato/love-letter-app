import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';

const DIFFICULTIES = [
  { label: 'Easy', grid: 3, pieces: 9 },
  { label: 'Medium', grid: 4, pieces: 16 },
  { label: 'Hard', grid: 5, pieces: 25 },
];

const HIDDEN_MESSAGES = [
  "You complete me, just like these pieces 💕",
  "Every fragment of you fits perfectly into my world",
  "Together we make something beautiful",
  "You are my missing piece, always and forever",
];

function generatePuzzle(grid) {
  const pieces = [];
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      pieces.push({
        id: r * grid + c,
        correctPos: r * grid + c,
        row: r,
        col: c,
        currentSlot: null,
      });
    }
  }
  // Shuffle
  const shuffled = [...pieces].sort(() => Math.random() - 0.5);
  return shuffled;
}

function PuzzlePiece({ piece, grid, size, onDragStart, isDragging }) {
  const bgX = -(piece.col * 100);
  const bgY = -(piece.row * 100);
  const totalSize = size * grid;

  return (
    <motion.div
      draggable
      onDragStart={() => onDragStart(piece)}
      className="puzzle-piece rounded-sm overflow-hidden select-none"
      style={{
        width: size,
        height: size,
        cursor: 'grab',
        background: `
          radial-gradient(ellipse 80% 60% at ${30 + piece.col * 15}% ${40 + piece.row * 10}%, 
            hsl(${340 + piece.id * 3}, 60%, ${25 + piece.id * 2}%) 0%, 
            hsl(${320 + piece.id * 4}, 40%, 15%) 100%)
        `,
        border: '1px solid rgba(255,183,197,0.25)',
        boxShadow: isDragging ? '0 20px 40px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
    >
      {/* Simulated photo content with gradient art */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at ${50 - piece.col * 8}% ${60 - piece.row * 8}%, 
              rgba(255,140,100,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at ${70 + piece.col * 5}% ${30 + piece.row * 5}%, 
              rgba(255,183,197,0.2) 0%, transparent 40%)
          `,
        }}
      />
      {/* Puzzle notch decoration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/10 text-xs font-mono">{piece.correctPos + 1}</span>
      </div>
    </motion.div>
  );
}

function DropSlot({ slotIndex, occupant, grid, pieceSize, onDrop, isCorrect }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className="relative"
      style={{ width: pieceSize, height: pieceSize }}
      onDragOver={e => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={e => { e.preventDefault(); setIsOver(false); onDrop(slotIndex); }}
    >
      {/* Slot background */}
      <div
        className="absolute inset-0 rounded-sm transition-all duration-200"
        style={{
          background: isOver
            ? 'rgba(255,183,197,0.2)'
            : 'rgba(255,240,245,0.04)',
          border: `1px dashed ${isCorrect ? 'rgba(255,183,197,0.6)' : isOver ? 'rgba(255,183,197,0.5)' : 'rgba(255,183,197,0.15)'}`,
          boxShadow: isCorrect ? '0 0 12px rgba(255,183,197,0.4) inset' : 'none',
        }}
      />
      {/* Placed piece */}
      {occupant && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${30 + occupant.col * 15}% ${40 + occupant.row * 10}%, 
              hsl(${340 + occupant.id * 3}, 60%, ${25 + occupant.id * 2}%) 0%, 
              hsl(${320 + occupant.id * 4}, 40%, 15%) 100%)`,
            border: isCorrect ? '1px solid rgba(255,183,197,0.6)' : '1px solid rgba(255,183,197,0.2)',
            boxShadow: isCorrect ? '0 0 20px rgba(255,183,197,0.4)' : 'none',
            overflow: 'hidden',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(ellipse at ${50 - occupant.col * 8}% ${60 - occupant.row * 8}%, 
                rgba(255,140,100,0.3) 0%, transparent 50%)`,
            }}
          />
          {isCorrect && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <div className="w-4 h-4 rounded-full bg-sakura/40 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function PuzzlePage() {
  const [difficulty, setDifficulty] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [slots, setSlots] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');

  const grid = difficulty ? DIFFICULTIES[difficulty].grid : 3;
  const pieceSize = Math.min(Math.floor(Math.min(300, window.innerWidth - 80) / grid), 90);

  const startGame = (diffIdx) => {
    setDifficulty(diffIdx);
    const g = DIFFICULTIES[diffIdx].grid;
    const newPieces = generatePuzzle(g);
    setPieces(newPieces);
    setSlots(Array(g * g).fill(null));
    setCompleted(false);
    setMessage('');
    setDragging(null);
  };

  const handleDragStart = (piece) => setDragging(piece);

  const handleDrop = (slotIndex) => {
    if (!dragging) return;
    const g = DIFFICULTIES[difficulty].grid;

    setSlots(prev => {
      const next = [...prev];
      // Remove from previous slot if any
      const prevSlot = next.findIndex(s => s && s.id === dragging.id);
      if (prevSlot !== -1) next[prevSlot] = null;
      // Swap if slot occupied
      if (next[slotIndex]) {
        if (prevSlot !== -1) next[prevSlot] = next[slotIndex];
        else setPieces(pp => [...pp, next[slotIndex]]);
      }
      next[slotIndex] = dragging;
      return next;
    });

    setPieces(prev => prev.filter(p => p.id !== dragging.id));
    setDragging(null);

    // Check completion after state update
    setTimeout(() => {
      setSlots(current => {
        const allCorrect = current.every((s, i) => s && s.correctPos === i);
        if (allCorrect && current.every(s => s !== null)) {
          setCompleted(true);
          setMessage(HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)]);
        }
        return current;
      });
    }, 100);
  };

  return (
    <PageLayout title="Put Us Together" subtitle="Assemble the pieces of our love">
      <AnimatePresence mode="wait">
        {!difficulty && difficulty !== 0 ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-white/50 text-sm mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
              Choose your challenge level
            </p>
            {DIFFICULTIES.map((d, i) => (
              <motion.button
                key={d.label}
                onClick={() => startGame(i)}
                className="glass rounded-xl px-8 py-4 w-full max-w-xs text-left flex items-center justify-between group transition-all duration-300"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{ border: '1px solid rgba(255,183,197,0.2)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div>
                  <div className="text-white/90 font-serif text-lg">{d.label}</div>
                  <div className="text-white/40 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>{d.pieces} pieces</div>
                </div>
                <div className="text-sakura opacity-0 group-hover:opacity-100 transition-opacity">→</div>
              </motion.button>
            ))}
          </motion.div>
        ) : completed ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* Fireworks */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#ffb7c5','#ffd0dd','#ff6b99','#f9a8c9'][i % 4],
                  left: `${30 + Math.random() * 40}%`,
                  top: `${20 + Math.random() * 40}%`,
                }}
                animate={{
                  y: [0, -60 - Math.random() * 60],
                  x: [(Math.random() - 0.5) * 80],
                  opacity: [1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 1.5, delay: i * 0.1, repeat: 3 }}
              />
            ))}
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 2 }}
            >
              💑
            </motion.div>
            <h2 className="text-3xl font-serif italic text-white glow-text">
              We're Complete!
            </h2>
            <p
              className="text-white/70 text-lg max-w-xs italic"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              "{message}"
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => startGame(difficulty)}
                className="glass rounded-xl px-6 py-3 text-white/80 text-sm hover:text-sakura transition-colors"
                style={{ border: '1px solid rgba(255,183,197,0.3)' }}
              >
                Play Again
              </button>
              <button
                onClick={() => setDifficulty(null)}
                className="rounded-xl px-6 py-3 text-sm transition-all"
                style={{ background: 'rgba(255,183,197,0.2)', border: '1px solid rgba(255,183,197,0.4)', color: '#ffb7c5' }}
              >
                Change Level
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Progress */}
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs text-white/40 mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                <span>{slots.filter(s => s && s.correctPos === slots.indexOf(s)).length} / {grid * grid} correct</span>
                <button onClick={() => setDifficulty(null)} className="text-sakura/60 hover:text-sakura">← Back</button>
              </div>
              <div className="h-1 rounded-full" style={{ background: 'rgba(255,183,197,0.15)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #ffb7c5, #ff6b99)' }}
                  animate={{ width: `${(slots.filter((s, i) => s && s.correctPos === i).length / (grid * grid)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Puzzle grid */}
            <div
              className="glass rounded-2xl p-3 sm:p-4"
              style={{ border: '1px solid rgba(255,183,197,0.2)' }}
            >
              <div
                style={{ display: 'grid', gridTemplateColumns: `repeat(${grid}, ${pieceSize}px)`, gap: 3 }}
              >
                {slots.map((occupant, i) => (
                  <DropSlot
                    key={i}
                    slotIndex={i}
                    occupant={occupant}
                    grid={grid}
                    pieceSize={pieceSize}
                    onDrop={handleDrop}
                    isCorrect={occupant && occupant.correctPos === i}
                  />
                ))}
              </div>
            </div>

            {/* Available pieces */}
            <div>
              <p className="text-white/30 text-xs text-center mb-3" style={{ fontFamily: 'Lato, sans-serif' }}>
                Drag pieces into the grid above
              </p>
              <div
                className="glass rounded-xl p-3 flex flex-wrap gap-2 justify-center"
                style={{ maxWidth: pieceSize * grid + (grid - 1) * 3 + 24, border: '1px solid rgba(255,183,197,0.15)' }}
              >
                {pieces.map(piece => (
                  <PuzzlePiece
                    key={piece.id}
                    piece={piece}
                    grid={grid}
                    size={pieceSize}
                    onDragStart={handleDragStart}
                    isDragging={dragging?.id === piece.id}
                  />
                ))}
                {pieces.length === 0 && (
                  <p className="text-white/20 text-xs p-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                    All pieces placed!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
