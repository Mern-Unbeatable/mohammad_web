import { ImagePlus, X } from "lucide-react";
import { FormLabel, Input } from "@/components/form-controls";
import { IMAGE_ACCEPT, MAX_FILE_MB } from "../../constant/constants";

/** Cover image: upload area or preview with Replace / Remove, and a URL field when no file is picked. */
const CoverImageField = ({
  fileInputRef,
  preview,
  hasFile,
  imageUrl,
  disabled,
  onPick,
  onClear,
  onUrlChange,
}) => (
  <div>
    <FormLabel as="p" variant="editor">
      Cover image
    </FormLabel>
    <input
      ref={fileInputRef}
      type="file"
      accept={IMAGE_ACCEPT}
      className="hidden"
      disabled={disabled}
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) onPick(file);
      }}
    />

    {preview ? (
      <div className="overflow-hidden rounded-xl border border-[#D0D5DD] bg-[#F9FAFB]">
        <img src={preview} alt="" className="aspect-[16/9] w-full object-cover" />
        <div className="flex gap-2 border-t border-[#E4E7EC] p-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 rounded-md border border-[#D0D5DD] px-3 py-2 text-[12px] font-semibold text-[#475467] hover:bg-white disabled:opacity-50"
          >
            Replace
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className="inline-flex items-center justify-center rounded-md border border-[#D0D5DD] px-3 py-2 text-[#CC1016] hover:bg-white disabled:opacity-50"
            aria-label="Remove cover image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    ) : (
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/40 disabled:opacity-50 sm:px-6 sm:py-10"
      >
        <ImagePlus className="mb-3 h-8 w-8 text-[#98A2B3]" />
        <span className="text-[14px] font-semibold text-deep-blue">Click to upload cover image</span>
        <span className="mt-1 text-[12px] text-[#64748B]">
          JPG, PNG, WebP or GIF — up to {MAX_FILE_MB} MB
        </span>
      </button>
    )}

    {!hasFile ? (
      <div className="mt-3">
        <FormLabel variant="editor" htmlFor="blog-image-url">
          Or paste image URL
        </FormLabel>
        <Input
          variant="editor"
          id="blog-image-url"
          type="url"
          value={imageUrl}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder="https://…"
          disabled={disabled}
        />
      </div>
    ) : null}
  </div>
);

export default CoverImageField;
