import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';

const LETTERS = [
  {
    id: 1,
    title: "The Day I Knew",
    date: "February 14, 2022",
    preview: "I still remember the exact moment...",
    color: "#ff6b99",
    content: `My dearest,

I still remember the exact moment I knew — you were laughing at something completely silly, and the whole world seemed to pause. The light caught your eyes in that perfect way, and I thought: *this is it. This is the person.*

People say love is complicated, but with you, it was the simplest thing I've ever felt. Like breathing. Like coming home after a very long journey.

Every day with you is a gift I don't know how to deserve. But I'm learning. I'm learning to be worthy of your laughter, your patience, your extraordinary kindness.

You are the best thing that ever walked into my life — softly, without warning, and changed everything.

All my love, always,
Yours ✦`,
  },
  {
    id: 2,
    title: "What I Love About You",
    date: "June 20, 2022",
    preview: "A list that could fill a thousand pages...",
    color: "#f9a8c9",
    content: `My love,

A list that could fill a thousand pages, but I'll start somewhere:

The way you laugh with your whole heart, not just your face. The warmth of your hand in the cold. How you remember small things I said months ago. Your voice in the morning, still half-asleep. The way you look at me like I'm something worth keeping.

The patience you have that I'm still learning. How you make ordinary days feel like celebrations. Your stubborn kindness even when the world is difficult.

The fact that you exist in the same world as me — that our paths crossed — still feels like the most extraordinary luck.

I love you in ways I don't have words for yet. And I'm spending a lifetime finding them.

Forever yours,
✦`,
  },
  {
    id: 3,
    title: "For the Hard Days",
    date: "September 3, 2022",
    preview: "I want you to read this when things feel heavy...",
    color: "#818cf8",
    content: `My darling,

I want you to read this when things feel heavy, when the world seems too loud, when you're not sure if you're enough.

You are more than enough. You always have been.

There will be days when I can't say the right thing, when words fail both of us. But please know — in those moments of quiet, of frustration, of distance — I am still completely, irreversibly yours.

Love isn't always grand gestures and golden light. Sometimes it's sitting beside someone in the dark, not saying anything, just staying.

I'm staying.

I'll always stay.

With everything I have,
Your person ✦`,
  },
  {
    id: 4,
    title: "Our Future",
    date: "December 31, 2023",
    preview: "I've been thinking about where we're going...",
    color: "#34d399",
    content: `My heart,

I've been thinking about where we're going — not with fear, but with this quiet, steady joy that surprises me sometimes.

I see us in small moments: morning coffee going cold because we talked too long. Road trips where we sing badly and not care. Growing old and still finding each other funny.

I don't need grand adventures (though I'd take them all with you). I just need Tuesday evenings. I need the familiar weight of your hand. I need to keep discovering you, slowly, year by year.

The future feels bright when I imagine it with you in it. Not because it'll be perfect — it won't — but because we'll face it together. And together, we're something I'm very proud of.

Here's to everything ahead,
All of me ✦`,
  },
];

function TypewriterText({ text, isOpen }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) { setDisplayed(''); indexRef.current = 0; return; }
    indexRef.current = 0;
    setDisplayed('');
    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(timerRef.current);
      }
    }, 18);
    return () => clearInterval(timerRef.current);
  }, [text, isOpen]);

  return (
    <p
      className="whitespace-pre-wrap leading-relaxed text-sm"
      style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '15px',
        color: 'rgba(255,240,245,0.75)',
        letterSpacing: '0.01em',
        lineHeight: '1.9',
      }}
    >
      {displayed}
      {displayed.length < text.length && (
        <span className="typewriter-cursor" style={{ color: '#ffb7c5' }} />
      )}
    </p>
  );
}

function LetterCard({ letter, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Envelope / closed state */}
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="closed"
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="cursor-pointer group"
          >
            <div
              className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300"
              style={{
                background: 'rgba(255,240,245,0.06)',
                border: '1px solid rgba(255,183,197,0.18)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              {/* Envelope icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${letter.color}22`, border: `1px solid ${letter.color}44` }}
              >
                💌
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white/85 font-serif text-base">{letter.title}</h3>
                <p className="text-white/35 text-xs mt-0.5" style={{ fontFamily: 'Lato, sans-serif' }}>{letter.date}</p>
                <p
                  className="text-white/40 text-sm mt-1 italic truncate"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {letter.preview}
                </p>
              </div>
              <motion.div
                className="text-white/30 group-hover:text-sakura transition-colors text-sm"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Open →
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,240,245,0.07)',
                border: `1px solid ${letter.color}44`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${letter.color}22`,
              }}
            >
              {/* Header */}
              <div
                className="px-6 pt-6 pb-4 border-b"
                style={{ borderColor: `${letter.color}22` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="font-serif text-xl italic"
                      style={{ color: letter.color }}
                    >
                      {letter.title}
                    </h3>
                    <p className="text-white/30 text-xs mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {letter.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-white/30 hover:text-white/60 transition-colors text-sm"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    × Close
                  </button>
                </div>
              </div>

              {/* Letter content with typewriter */}
              <div className="px-6 py-6">
                {/* Decorative ruled lines */}
                <div className="relative">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full"
                      style={{
                        height: '1px',
                        background: `${letter.color}10`,
                        top: `${(i + 1) * 38}px`,
                      }}
                    />
                  ))}
                  <TypewriterText text={letter.content} isOpen={open} />
                </div>
              </div>

              {/* Wax seal decoration */}
              <div className="px-6 pb-6 flex justify-end">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                  style={{
                    background: `radial-gradient(circle, ${letter.color}88, ${letter.color}44)`,
                    border: `2px solid ${letter.color}66`,
                    boxShadow: `0 4px 12px ${letter.color}44`,
                  }}
                >
                  ✦
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NotesPage() {
  return (
    <PageLayout title="Love Notes" subtitle="Words written only for you">
      <div className="max-w-lg mx-auto space-y-4">
        {LETTERS.map((letter, i) => (
          <LetterCard key={letter.id} letter={letter} index={i} />
        ))}
      </div>
    </PageLayout>
  );
}
