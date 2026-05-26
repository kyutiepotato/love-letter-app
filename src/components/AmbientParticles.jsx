import { useEffect, useRef } from 'react';

export default function AmbientParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -0.1 - Math.random() * 0.3,
      alpha: 0,
      maxAlpha: 0.3 + Math.random() * 0.4,
      growing: true,
      speed: 0.003 + Math.random() * 0.004,
      hue: 340 + Math.random() * 30,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        if (p.growing) {
          p.alpha += p.speed;
          if (p.alpha >= p.maxAlpha) p.growing = false;
        } else {
          p.alpha -= p.speed * 0.7;
          if (p.alpha <= 0) {
            p.x = Math.random() * W;
            p.y = H + 10;
            p.alpha = 0;
            p.growing = true;
            p.r = 1 + Math.random() * 3;
            p.dx = (Math.random() - 0.5) * 0.3;
            p.dy = -0.1 - Math.random() * 0.3;
          }
        }
        p.x += p.dx;
        p.y += p.dy;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 80%, ${p.alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 80%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
