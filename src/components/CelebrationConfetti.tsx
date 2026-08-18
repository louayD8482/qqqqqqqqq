import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface CelebrationConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const GOLD_COLORS = ['#F59E0B', '#FBBF24', '#FCD34D', '#10B981', '#34D399', '#FFFFFF', '#D97706'];

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({ active, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Generate confetti particles
    const count = 45;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() * 20 - 10), // start near center
      y: 50 + (Math.random() * 20 - 10),
      size: Math.random() * 8 + 4,
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      rotation: Math.random() * 360,
      speedX: (Math.random() - 0.5) * 12,
      speedY: (Math.random() - 0.7) * 14,
      opacity: 1,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-ping"
          style={{
            left: `${p.x + p.speedX * 3}%`,
            top: `${p.y + p.speedY * 3}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            boxShadow: `0 0 10px ${p.color}`,
            transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
      ))}
      {/* Central Flash Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
    </div>
  );
};
