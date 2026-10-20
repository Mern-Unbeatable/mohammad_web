import { useState } from "react";

/** Main image plus thumbnails. Render with `key={listing.id}` so the selection resets per listing. */
const ListingGallery = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-[#F9FAFB]">
        <img src={images[activeImage]} alt={title} className="aspect-[16/10] w-full object-cover" />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
              className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors ${
                activeImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-[#D0D5DD]"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ListingGallery;
