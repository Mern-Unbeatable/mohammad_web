import { useState } from 'react';
import ImageViewer from '@/components/common/ImageViewer/ImageViewer';

const MAX_TILES = 4;

/** Feed post images: 1 full width, 2 side by side, 3 as one wide plus two, 4+ as a 2×2 grid with "+N". */
const PostImageGallery = ({ images: imageList, image, className = 'mt-3' }) => {
  const [viewerIndex, setViewerIndex] = useState(null);
  const images = imageList?.length ? imageList : image ? [image] : [];
  if (!images.length) return null;

  const tiles = images.slice(0, MAX_TILES);
  const hidden = images.length - tiles.length;
  const single = images.length === 1;

  return (
    <>
      <div
        className={`${className} grid gap-1 overflow-hidden rounded-lg ${
          single ? 'grid-cols-1' : 'grid-cols-2'
        }`}
      >
        {tiles.map((src, index) => {
          const wide = images.length === 3 && index === 0;
          const showMore = hidden > 0 && index === tiles.length - 1;
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setViewerIndex(index)}
              className={`relative block overflow-hidden bg-[#F2F4F7] ${
                single ? 'aspect-[16/9]' : wide ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
              }`}
              aria-label={showMore ? `View ${hidden} more images` : `View image ${index + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              {showMore ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[24px] font-bold text-white sm:text-[28px]">
                  +{hidden}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {viewerIndex !== null ? (
        <ImageViewer
          images={images}
          index={viewerIndex}
          onChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      ) : null}
    </>
  );
};

export default PostImageGallery;
