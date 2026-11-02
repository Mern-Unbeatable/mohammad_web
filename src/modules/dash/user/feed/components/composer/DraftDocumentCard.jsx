import { FileText, X } from "lucide-react";

const DraftDocumentCard = ({ document, disabled, onRemove }) => (
  <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
      <FileText className="h-5 w-5 text-primary" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-semibold text-deep-blue">{document.name}</p>
      <p className="text-[12px] text-[#64748B]">{document.meta}</p>
    </div>
    <button
      type="button"
      disabled={disabled}
      onClick={onRemove}
      className="rounded-md p-1.5 text-[#64748B] hover:bg-white"
      aria-label="Remove document"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

export default DraftDocumentCard;
