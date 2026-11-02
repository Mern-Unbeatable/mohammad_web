import { useState } from 'react';
import { UserRound } from 'lucide-react';

const sizes = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-9 w-9 text-[12px]',
  md: 'h-11 w-11 text-[13px]',
  lg: 'h-14 w-14 text-[16px]',
  xl: 'h-[104px] w-[104px] text-[28px]',
};

const iconSizes = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-[18px] w-[18px]',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
  xl: 'h-12 w-12',
};

const MISSING_SRC_VALUES = new Set(['', 'null', 'undefined']);
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'blob:', 'data:']);

/** Returns '' when no picture was set, null when the value is unusable, otherwise the URL. */
const resolveImageSrc = (src) => {
  if (typeof src !== 'string') return src ? null : '';
  const value = src.trim();
  if (MISSING_SRC_VALUES.has(value.toLowerCase())) return '';
  try {
    const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
    const url = new URL(value, base);
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
    if (url.protocol === 'data:' && !/^data:image\//i.test(value)) return null;
    return value;
  } catch {
    return null;
  }
};

const firstLetter = (...candidates) => {
  const name = candidates.find((value) => typeof value === 'string' && value.trim());
  return name ? Array.from(name.trim())[0].toUpperCase() : '';
};

const Avatar = ({ initials, src, alt = '', size = 'md', className = '' }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const imageSrc = resolveImageSrc(src);
  const letter = firstLetter(alt, initials);
  const showImage = Boolean(imageSrc) && failedSrc !== imageSrc;
  const showLetter = imageSrc === '' && Boolean(letter);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F3FB] font-semibold text-primary ${sizes[size]} ${className}`}
      {...(!showImage && alt ? { role: 'img', 'aria-label': alt } : {})}
    >
      {showImage ? (
        <img
          src={imageSrc}
          alt={alt}
          onError={() => setFailedSrc(imageSrc)}
          className="h-full w-full object-cover"
        />
      ) : showLetter ? (
        <span aria-hidden={alt ? true : undefined}>{letter}</span>
      ) : (
        <UserRound aria-hidden="true" className={iconSizes[size] || iconSizes.md} strokeWidth={2} />
      )}
    </div>
  );
};

export default Avatar;
