import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBodyScrollLock } from "@/shared/hooks/useBodyScrollLock";

/** Full-screen image overlay; closes on Escape, backdrop click or the X button. */
const ImageViewer = ({ images, index = 0, onChange, onClose, alt = "" }) => {
  const count = images.length;
  const go = (step) => onChange?.((index + step + count) % count);

  useBodyScrollLock();

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (count > 1 && event.key === "ArrowLeft")
        onChange?.((index - 1 + count) % count);
      if (count > 1 && event.key === "ArrowRight")
        onChange?.((index + 1) % count);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [count, index, onChange, onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md motion-safe:animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={count > 1 ? `Image ${index + 1} of ${count}` : alt || "Image"}
    >
      <img
        src={images[index]}
        alt={alt}
        className="max-h-[85vh] max-w-full rounded-lg object-contain motion-safe:animate-fade-in-up"
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
        aria-label="Close image"
      >
        <X className="h-5 w-5" />
      </button>
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute right-3 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="absolute bottom-4 rounded-full bg-black/50 px-3 py-1 text-[13px] text-white">
            {index + 1} / {count}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default ImageViewer;
