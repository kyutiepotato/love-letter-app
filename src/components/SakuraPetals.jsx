import { useEffect, useRef } from 'react';

const PETAL_SHAPES = [
  // Rounded petal
  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z" fill="currentColor" opacity="0.85"/>
  </svg>`,
  // Sakura petal
  `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="15" cy="15" rx="6" ry="13" fill="currentColor" opacity="0.8" transform="rotate(-20 15 15)"/>
  </svg>`,
  // Small round petal
  `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="10" cy="10" rx="5" ry="9" fill="currentColor" opacity="0.75"/>
  </svg>`,
];

const COLORS = [
  '#ffb7c5', '#ffd0dd', '#ffc2cc', '#ff9ab5', '#ffe0e9',
  '#f9a8c9', '#ffcdd8', '#fba7bc',
];

export default function SakuraPetals() {
  const containerRef = useRef(null);
  const petalsRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const COUNT = 28;
    const petals = [];

    function makePetal() {
      const el = document.createElement('div');
      const shapeIdx = Math.floor(Math.random() * PETAL_SHAPES.length);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 10 + Math.random() * 16;
      const opacity = 0.4 + Math.random() * 0.5;
      const blur = Math.random() < 0.3 ? `blur(${Math.random() * 1.5}px)` : '';

      el.innerHTML = PETAL_SHAPES[shapeIdx];
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 15;
        width: ${size}px;
        height: ${size}px;
        color: ${color};
        opacity: ${opacity};
        filter: ${blur};
        will-change: transform;
      `;

      const petal = {
        el,
        x: Math.random() * 110 - 5, // vw
        y: -15 - Math.random() * 10, // vh
        speed: 0.25 + Math.random() * 0.45,
        drift: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        sway: Math.random() * 2 * Math.PI,
        swaySpeed: 0.008 + Math.random() * 0.012,
        swayAmt: 0.8 + Math.random() * 1.5,
        size,
      };

      container.appendChild(el);
      petals.push(petal);
      return petal;
    }

    // Stagger initial creation
    for (let i = 0; i < COUNT; i++) {
      const p = makePetal();
      p.y = Math.random() * 120 - 10; // distribute initially
    }

    petalsRef.current = petals;
    let last = performance.now();

    function animate(now) {
      const dt = Math.min((now - last) / 16, 3);
      last = now;

      for (const p of petals) {
        p.sway += p.swaySpeed * dt;
        const swayX = Math.sin(p.sway) * p.swayAmt;

        p.x += (p.drift + swayX * 0.05) * dt;
        p.y += p.speed * dt;
        p.rot += p.rotSpeed * dt;

        if (p.y > 115) {
          p.y = -12 - Math.random() * 8;
          p.x = Math.random() * 110 - 5;
          p.sway = Math.random() * 2 * Math.PI;
        }

        p.el.style.transform = `translate(${p.x}vw, ${p.y}vh) rotate(${p.rot}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      petals.forEach(p => p.el.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 overflow-hidden" />;
}
