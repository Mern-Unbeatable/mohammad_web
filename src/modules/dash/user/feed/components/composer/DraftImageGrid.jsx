import { X } from "lucide-react";
import { MAX_POST_IMAGES } from "../../constants";

/** Selected images in the composer; a single image is shown wide. */
const DraftImageGrid = ({ images, disabled, onRemove }) => {
  const single = images.length === 1;

  return (
    <div className="mt-3">
      <div className={`grid gap-2 ${single ? "grid-cols-1" : "grid-cols-5"}`}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] ${
              single ? "min-h-[56px]" : "aspect-square"
            }`}
          >
            <img
              src={image.preview || image.url}
              alt=""
              className={single ? "max-h-56 w-full object-cover" : "h-full w-full object-cover"}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemove(image.id)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[12px] text-[#64748B]">
        {images.length} / {MAX_POST_IMAGES} images
      </p>
    </div>
  );
};

export default DraftImageGrid;
