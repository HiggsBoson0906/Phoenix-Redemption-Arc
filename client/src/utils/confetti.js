/**
 * confetti.js — Lightweight pure canvas confetti particle generator.
 * No external dependencies required.
 */

let canvas = null;
let ctx = null;
let animationFrameId = null;
let particles = [];

function getOrCreateCanvas() {
  if (canvas && document.body.contains(canvas)) {
    return canvas;
  }
  canvas = document.createElement('canvas');
  canvas.id = 'algoatlas-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  const resize = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();
  return canvas;
}

const COLORS = [
  '#10b981', '#34d399', '#3b82f6', '#60a5fa',
  '#f59e0b', '#fbbf24', '#ec4899', '#a855f7', '#6366f1'
];

export function triggerConfetti(options = {}) {
  const {
    particleCount = 75,
    spread = 70,
    origin = { x: 0.5, y: 0.6 },
    duration = 2800,
  } = options;

  getOrCreateCanvas();
  const startX = window.innerWidth * origin.x;
  const startY = window.innerHeight * origin.y;

  const now = Date.now();
  const endTime = now + duration;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI / 180) * (90 + (Math.random() - 0.5) * spread * 2);
    const speed = Math.random() * 10 + 6;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.abs(Math.sin(angle) * speed) - Math.random() * 4,
      size: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      friction: 0.98,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.01,
      shape: Math.random() > 0.3 ? 'rect' : 'circle',
    });
  }

  if (!animationFrameId) {
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > window.innerHeight + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animationFrameId = requestAnimationFrame(render);
  }
}
