import { useRef } from "react";
import { FileText, Image, Loader2 } from "lucide-react";
import { DOCUMENT_ACCEPT, IMAGE_ACCEPT, MAX_POST_IMAGES } from "../../constants";

const attachButtonClass = (active) =>
  `inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-[13px] font-medium hover:bg-[#F9FAFB] sm:flex-none ${
    active ? "border-primary bg-secondary text-primary" : "border-[#E4E7EC] text-[#475467]"
  }`;

/** Reads the picked files and clears the input so the same file can be picked again. */
const takeFiles = (event) => {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  return files;
};

/** Attach buttons (with their hidden file inputs) and Cancel / Publish. */
const ComposerFooter = ({ draft, onClose }) => {
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const { busy, canAddImages } = draft;

  const handleImagePick = (event) => {
    const files = takeFiles(event);
    if (files.length) draft.addImages(files);
  };

  const handleDocumentPick = (event) => {
    const [file] = takeFiles(event);
    if (file) draft.setDocument(file);
  };

  return (
    <div className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-3 border-t border-[#E4E7EC] bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 sm:pb-4">
      <div className="flex gap-2">
        <input
          ref={imageInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="hidden"
          onChange={handleImagePick}
        />
        <input
          ref={documentInputRef}
          type="file"
          accept={DOCUMENT_ACCEPT}
          className="hidden"
          onChange={handleDocumentPick}
        />
        <button
          type="button"
          disabled={busy || !canAddImages}
          title={canAddImages ? undefined : `Up to ${MAX_POST_IMAGES} images`}
          onClick={() => imageInputRef.current?.click()}
          className={`${attachButtonClass(draft.hasImage)} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Image className="h-4 w-4" />
          Image
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => documentInputRef.current?.click()}
          className={attachButtonClass(draft.hasDocument)}
        >
          <FileText className="h-4 w-4" />
          Document
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="inline-flex flex-1 items-center justify-center rounded-md border border-[#E4E7EC] py-2.5 text-[14px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-5"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!draft.canPublish}
          onClick={draft.publish}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-6"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {draft.submitLabel}
        </button>
      </div>
    </div>
  );
};

export default ComposerFooter;
