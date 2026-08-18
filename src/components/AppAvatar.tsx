import React, { useState, useEffect } from 'react';
import defaultIcon from '../assets/images/subha_icon.jpg';

interface AppAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  sizeClassName?: string;
  showBadge?: boolean;
  isCircle?: boolean;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({
  src,
  alt = 'شعار سبحة نور الإسلام',
  className = '',
  sizeClassName = 'w-10 h-10',
  showBadge = false,
  isCircle = true,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || defaultIcon);
  const [hasError, setHasError] = useState(false);
  const roundedClass = isCircle ? 'rounded-full' : 'rounded-2xl';

  useEffect(() => {
    setCurrentSrc(src || defaultIcon);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== defaultIcon) {
      setCurrentSrc(defaultIcon);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative flex-shrink-0 ${roundedClass} ${sizeClassName} ${className}`}>
      {!hasError ? (
        <img
          src={currentSrc}
          alt={alt}
          onError={handleError}
          className={`w-full h-full object-cover select-none ${roundedClass}`}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : (
        /* Guaranteed Luxury Fallback SVG when image file fails or is offline */
        <div className={`w-full h-full ${roundedClass} bg-gradient-to-br from-amber-400 via-amber-600 to-emerald-900 flex flex-col items-center justify-center text-white shadow-inner p-1`}>
          <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-amber-200 fill-current drop-shadow-md">
            {/* Islamic Subha Beads Circle */}
            <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3 7" />
            <circle cx="50" cy="18" r="5" fill="#fef08a" />
            <circle cx="72" cy="28" r="4.5" fill="#fef08a" />
            <circle cx="82" cy="50" r="4.5" fill="#fef08a" />
            <circle cx="72" cy="72" r="4.5" fill="#fef08a" />
            <circle cx="50" cy="82" r="4.5" fill="#fef08a" />
            <circle cx="28" cy="72" r="4.5" fill="#fef08a" />
            <circle cx="18" cy="50" r="4.5" fill="#fef08a" />
            <circle cx="28" cy="28" r="4.5" fill="#fef08a" />
            {/* Center Crescent and Star */}
            <path d="M48 36 a14 14 0 1 0 14 14 a11 11 0 1 1 -14 -14 Z" fill="#fbbf24" />
            <polygon points="56,42 58,47 63,47 59,50 61,55 56,52 52,55 54,50 50,47 55,47" fill="#ffffff" />
          </svg>
        </div>
      )}

      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0e1624] rounded-full shadow-sm ring-1 ring-emerald-400"></span>
      )}
    </div>
  );
};

