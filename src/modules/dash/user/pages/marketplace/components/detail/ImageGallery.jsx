import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import ImageViewer from '@/components/common/ImageViewer/ImageViewer';
import { VISIBLE_THUMBNAILS } from '../../constant/constants';

const arrowClass =
  'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-deep-blue shadow-md transition hover:bg-white disabled:pointer-events-none disabled:opacity-0';

const ImageGallery = ({ images, title, activeImage, onSelect }) => {
  const stripRef = useRef(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const closeViewer = useCallback(() => setViewerOpen(false), []);
  const count = images.length;
  const hasMany = count > 1;
  const scrollable = count > VISIBLE_THUMBNAILS;

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[activeImage];
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft;
    const right = left + thumb.offsetWidth;
    if (left < strip.scrollLeft) {
      strip.scrollTo({ left, behavior: 'smooth' });
    } else if (right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: right - strip.clientWidth, behavior: 'smooth' });
    }
  }, [activeImage]);

  const step = (direction) => onSelect((activeImage + direction + count) % count);

  const scrollStrip = (direction) => {
    const strip = stripRef.current;
    if (strip) strip.scrollBy({ left: direction * strip.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl bg-[#F9FAFB]">
        {images[activeImage] ? (
          <>
            <img
              src={images[activeImage]}
              alt={title}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                aria-label="View full screen"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-deep-blue opacity-0 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center text-[13px] text-[#98A2B3]">
            No image
          </div>
        )}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className={`${arrowClass} left-3`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className={`${arrowClass} right-3`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-semibold text-white">
              {activeImage + 1} / {count}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="relative mt-3">
          <div
            ref={stripRef}
            className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={activeImage === index}
                className={`aspect-[4/3] w-[calc((100%-1.875rem)/4)] shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImage === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-[#D0D5DD]'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {scrollable && (
            <>
              <button
                type="button"
                onClick={() => scrollStrip(-1)}
                aria-label="Scroll thumbnails left"
                className={`${arrowClass} -left-3 h-8 w-8`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip(1)}
                aria-label="Scroll thumbnails right"
                className={`${arrowClass} -right-3 h-8 w-8`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}

      {viewerOpen && images[activeImage] ? (
        <ImageViewer
          images={images}
          index={activeImage}
          onChange={onSelect}
          onClose={closeViewer}
          alt={title}
        />
      ) : null}
    </div>
  );
};

export default ImageGallery;
