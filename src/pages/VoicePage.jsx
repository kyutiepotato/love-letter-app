import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';

const CHALLENGES = [
  {
    id: 1,
    question: "What is our anniversary date?",
    answer: "february 14",
    hint: "The day everything changed 💕",
    reward: "🌹",
    rewardMessage: "You remembered! That day, I fell for you completely.",
    color: "#ff6b99",
    difficulty: "Easy",
  },
  {
    id: 2,
    question: "What was our first movie together?",
    answer: "a walk to remember",
    hint: "A classic love story, just like ours",
    reward: "🎬",
    rewardMessage: "We cried together and I pretended not to. I hope you know I cried.",
    color: "#818cf8",
    difficulty: "Medium",
  },
  {
    id: 3,
    question: "What did I call you on our first date?",
    answer: "my sunshine",
    hint: "Something that means warmth and light",
    reward: "☀️",
    rewardMessage: "You still are. My sunshine, every single day.",
    color: "#fbbf24",
    difficulty: "Medium",
  },
  {
    id: 4,
    question: "Where did we have our first kiss?",
    answer: "the park",
    hint: "Somewhere green and beautiful, like us",
    reward: "💋",
    rewardMessage: "I still get butterflies thinking about that moment.",
    color: "#34d399",
    difficulty: "Hard",
  },
];

function FlipCard({ challenge, index }) {
  const [flipped, setFlipped] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('idle'); // idle | listening | correct | wrong | unsupported
  const [attempts, setAttempts] = useState(0);

  const normalize = str => str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  const startVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('unsupported');
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 5;

    setListening(true);
    setStatus('listening');
    setTranscript('');

    recog.onresult = (e) => {
      const heard = Array.from(e.results[0])
        .map(r => r.transcript)
        .join(' ');
      setTranscript(heard);
      const normHeard = normalize(heard);
      const normAnswer = normalize(challenge.answer);
      const isCorrect = normHeard.includes(normAnswer) || normAnswer.includes(normHeard);
      setAttempts(a => a + 1);
      if (isCorrect) {
        setStatus('correct');
        setTimeout(() => setFlipped(true), 800);
      } else {
        setStatus('wrong');
        setTimeout(() => setStatus('idle'), 2000);
      }
    };

    recog.onerror = () => { setStatus('idle'); setListening(false); };
    recog.onend = () => setListening(false);
    recog.start();
  }, [challenge.answer]);

  const forceReveal = () => {
    setFlipped(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className="perspective"
    >
      <div className={`flip-card ${flipped ? 'flipped' : ''}`} style={{ height: 200 }}>
        {/* Front */}
        <div
          className="flip-face absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,240,245,0.07)',
            border: `1px solid ${challenge.color}33`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
          }}
        >
          <div className="p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: `${challenge.color}22`,
                  color: challenge.color,
                  border: `1px solid ${challenge.color}44`,
                  fontFamily: 'Lato, sans-serif',
                }}
              >
                {challenge.difficulty}
              </div>
              {flipped ? null : (
                <div className="text-white/30 text-xs" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {attempts > 0 && `${attempts} attempt${attempts > 1 ? 's' : ''}`}
                </div>
              )}
            </div>

            {/* Question */}
            <p
              className="text-white/85 font-serif text-lg flex-1 flex items-center"
              style={{ lineHeight: '1.5' }}
            >
              {challenge.question}
            </p>

            {/* Hint */}
            <p className="text-white/30 text-xs italic mb-3" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Hint: {challenge.hint}
            </p>

            {/* Controls */}
            {status === 'unsupported' ? (
              <div className="space-y-2">
                <p className="text-yellow-400/70 text-xs" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Voice not supported in this browser
                </p>
                <button onClick={forceReveal} className="text-sakura text-xs underline" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Reveal answer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={startVoice}
                  disabled={listening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300"
                  style={{
                    background: status === 'listening'
                      ? `${challenge.color}44`
                      : status === 'correct'
                      ? 'rgba(52,211,153,0.3)'
                      : status === 'wrong'
                      ? 'rgba(239,68,68,0.2)'
                      : `${challenge.color}22`,
                    border: `1px solid ${status === 'correct' ? '#34d399' : status === 'wrong' ? '#ef4444' : challenge.color}55`,
                    color: status === 'correct' ? '#34d399' : status === 'wrong' ? '#ef4444' : challenge.color,
                    fontFamily: 'Lato, sans-serif',
                  }}
                >
                  {status === 'listening' && (
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ background: challenge.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  {status === 'idle' && '🎤'}
                  {status === 'correct' && '✓'}
                  {status === 'wrong' && '✗'}
                  <span>
                    {status === 'listening' ? 'Listening...'
                      : status === 'correct' ? 'Correct!'
                      : status === 'wrong' ? `I heard: "${transcript}"`
                      : 'Speak Answer'}
                  </span>
                </motion.button>

                {attempts >= 3 && !flipped && (
                  <button
                    onClick={forceReveal}
                    className="text-white/30 text-xs hover:text-white/50 transition-colors"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    Skip
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="flip-face flip-back absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 30%, ${challenge.color}22 0%, rgba(10,3,5,0.95) 70%)`,
            border: `1px solid ${challenge.color}55`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${challenge.color}33`,
          }}
        >
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <motion.div
              className="text-5xl mb-3"
              animate={flipped ? { scale: [0, 1.2, 1], rotate: [0, 10, 0] } : {}}
              transition={{ duration: 0.6 }}
            >
              {challenge.reward}
            </motion.div>
            <p
              className="text-white/80 text-sm italic"
              style={{ fontFamily: '"Cormorant Garamond", serif', lineHeight: '1.7' }}
            >
              "{challenge.rewardMessage}"
            </p>
            <button
              onClick={() => { setFlipped(false); setStatus('idle'); setAttempts(0); }}
              className="mt-4 text-xs text-white/25 hover:text-white/50 transition-colors"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VoicePage() {
  return (
    <PageLayout title="Voice Challenge" subtitle="Speak and reveal our secrets">
      <div className="max-w-lg mx-auto">
        {/* Instructions */}
        <motion.div
          className="glass rounded-2xl p-4 mb-6 flex gap-3"
          style={{ border: '1px solid rgba(255,183,197,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-2xl flex-shrink-0">🎤</span>
          <div>
            <p className="text-white/70 text-sm font-serif">
              Press the voice button and speak your answer aloud.
            </p>
            <p className="text-white/35 text-xs mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
              Answer correctly to flip the card and reveal a hidden memory. After 3 attempts, a skip option appears.
            </p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="space-y-4">
          {CHALLENGES.map((challenge, i) => (
            <FlipCard key={challenge.id} challenge={challenge} index={i} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
