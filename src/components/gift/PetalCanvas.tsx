import React, { useEffect, useRef } from 'react';

export const PetalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let id: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#ffe4e6', '#ffffff'];
    const petals = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h - h,
      size: 10 + Math.random() * 14,
      speedX: -1 + Math.random() * 2,
      speedY: 0.8 + Math.random() * 1.5,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.03,
      opacity: 0.4 + Math.random() * 0.45,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p) => {
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.4;
        p.y += p.speedY;
        p.rot += p.rotSpd;
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      });
      id = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-10 w-full h-full" />;
};