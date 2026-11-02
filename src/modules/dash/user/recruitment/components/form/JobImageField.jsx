import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

/**
 * Picks an image, uploads it right away through `onUpload(file) => url`, and
 * reports the URL with `onChange(url)`; `onChange("")` removes it.
 */
const JobImageField = ({
  value,
  onChange,
  onUpload,
  onUploadingChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const busy = disabled || uploading;

  const setBusy = (next) => {
    setUploading(next);
    onUploadingChange?.(next);
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please choose a JPG, PNG or WebP image");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Logo must be ${MAX_SIZE_MB} MB or smaller`);
      return;
    }

    setBusy(true);
    try {
      onChange(await onUpload(file));
    } catch (err) {
      toast.error(err?.message || "Logo upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-deep-blue">
        Company logo
        <span className="rounded-full bg-[#F2F4F7] px-2 py-px text-[11px] font-medium text-[#64748B]">
          Optional
        </span>
      </p>

      <div className="flex items-center gap-4 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-3 sm:p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E4E7EC] bg-white sm:h-[72px] sm:w-[72px]">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : value ? (
            <img src={value} alt="Company logo" className="h-full w-full object-contain p-1" />
          ) : (
            <ImagePlus className="h-6 w-6 text-[#98A2B3]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#344054] hover:bg-[#F2F4F7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading…" : value ? "Change logo" : "Upload logo"}
            </button>
            {value && !uploading ? (
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-semibold text-pink-light hover:bg-pink-secondary disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-1.5 text-[12px] text-[#64748B]">
            JPG, PNG or WebP, up to {MAX_SIZE_MB} MB. A square logo works best;
            it is shown on job cards and the job page.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFile}
          className="hidden"
          aria-label="Upload company logo"
        />
      </div>
    </div>
  );
};

export default JobImageField;
