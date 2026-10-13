import { useState } from 'react';
import { Eye } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import ImageViewer from '@/components/common/ImageViewer/ImageViewer';

const MISSING_SRC_VALUES = new Set(['', 'null', 'undefined']);

const hasPhoto = (src) =>
  typeof src === 'string' && !MISSING_SRC_VALUES.has(src.trim().toLowerCase());

/**
 * Avatar that opens the photo full screen on click. `className` positions the
 * wrapper (margins, shrink); `avatarClassName` styles the circle itself.
 */
const ZoomableAvatar = ({ src, alt = '', className = '', avatarClassName = '', ...avatarProps }) => {
  const [open, setOpen] = useState(false);
  const [failedSrc, setFailedSrc] = useState(null);
  const canZoom = hasPhoto(src) && failedSrc !== src;

  if (!canZoom) {
    return <Avatar src={src} alt={alt} className={`${className} ${avatarClassName}`} {...avatarProps} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `View ${alt}'s photo` : 'View photo'}
        className={`group relative cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${className}`}
      >
        <Avatar src={src} alt={alt} className={avatarClassName} {...avatarProps} />
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Eye className="h-1/4 w-1/4 min-h-4 min-w-4" strokeWidth={2} />
        </span>
      </button>
      {open ? (
        <ImageViewer images={[src]} alt={alt} onClose={() => setOpen(false)} />
      ) : null}
      <img src={src} alt="" hidden onError={() => setFailedSrc(src)} />
    </>
  );
};

export default ZoomableAvatar;
