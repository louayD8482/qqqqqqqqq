import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface VisualBeadRingProps {
  count: number;
  totalBeads: number; // typically 33 or 99
  radius?: number;
  theme: string;
}

export const VisualBeadRing: React.FC<VisualBeadRingProps> = ({
  count,
  totalBeads = 33,
  radius = 145,
  theme,
}) => {
  // Current bead index in circle (0 to totalBeads - 1)
  const currentBeadIndex = totalBeads > 0 ? (count % totalBeads) : 0;

  // Calculate coordinates for all beads
  const beads = useMemo(() => {
    const arr = [];
    const step = (2 * Math.PI) / totalBeads;
    // Start at top (- PI / 2)
    const startAngle = -Math.PI / 2;

    for (let i = 0; i < totalBeads; i++) {
      const angle = startAngle + i * step;
      const x = 160 + radius * Math.cos(angle);
      const y = 160 + radius * Math.sin(angle);
      
      // Marker bead every 11 beads
      const isSeparator = (i + 1) % 11 === 0 && i !== totalBeads - 1;
      const isMasterBead = i === 0;

      arr.push({
        index: i,
        x,
        y,
        isSeparator,
        isMasterBead,
      });
    }
    return arr;
  }, [totalBeads, radius]);

  // Color schemes for bead rings based on theme
  const getColors = () => {
    switch (theme) {
      case 'dark':
      case 'oled':
        return {
          activeGlow: '#eab308', // gold
          activeFill: '#facc15',
          completedFill: '#10b981', // emerald
          inactiveFill: '#334155', // slate-700
          track: 'rgba(51, 65, 85, 0.3)',
          separator: '#f59e0b',
        };
      case 'amber':
        return {
          activeGlow: '#f59e0b',
          activeFill: '#fbbf24',
          completedFill: '#d97706',
          inactiveFill: '#fde68a',
          track: 'rgba(217, 119, 6, 0.2)',
          separator: '#b45309',
        };
      case 'light':
        return {
          activeGlow: '#059669',
          activeFill: '#10b981',
          completedFill: '#047857',
          inactiveFill: '#e2e8f0',
          track: 'rgba(226, 232, 240, 0.8)',
          separator: '#d97706',
        };
      case 'emerald':
      default:
        return {
          activeGlow: '#fbbf24', // warm gold glow
          activeFill: '#fef08a',
          completedFill: '#34d399', // bright emerald
          inactiveFill: '#064e3b', // deep forest green
          track: 'rgba(16, 185, 129, 0.15)',
          separator: '#f59e0b',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full max-w-[340px] max-h-[340px] overflow-visible"
        aria-hidden="true"
      >
        {/* Subtle connecting necklace cord */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth="1.5"
          strokeDasharray={totalBeads > 33 ? '3 3' : undefined}
        />

        {/* Beads */}
        {beads.map((bead) => {
          const isCurrent = bead.index === currentBeadIndex;
          const isCompleted = bead.index < currentBeadIndex;
          const beadSize = bead.isMasterBead
            ? (isCurrent ? 7.5 : 6)
            : bead.isSeparator
            ? 5.5
            : (isCurrent ? 6 : totalBeads > 33 ? 3.5 : 4.5);

          return (
            <g key={bead.index}>
              {/* Highlight halo on active bead - static and stable */}
              {isCurrent && (
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r={beadSize * 1.8}
                  fill={colors.activeGlow}
                  opacity={0.3}
                />
              )}

              {/* Main bead */}
              <circle
                cx={bead.x}
                cy={bead.y}
                r={beadSize}
                fill={
                  isCurrent
                    ? colors.activeFill
                    : isCompleted
                    ? colors.completedFill
                    : bead.isSeparator
                    ? colors.separator
                    : colors.inactiveFill
                }
                stroke={isCurrent ? '#ffffff' : 'none'}
                strokeWidth={isCurrent ? 1.5 : 0}
                className="transition-colors duration-200"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
