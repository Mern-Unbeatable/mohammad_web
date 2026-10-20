import { useEffect } from "react";
import { X } from "lucide-react";
import CandidateRow from "@/modules/dash/user/recruitment/components/candidates/CandidateRow";

/** Full applicant list; Escape is ignored while a stacked dialog is open. */
const AllCandidatesModal = ({
  open,
  candidates = [],
  onClose,
  onView,
  escapePaused = false,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !escapePaused) onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, escapePaused]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[520px] flex-col rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-candidates-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5 sm:py-4">
          <h2
            id="all-candidates-title"
            className="text-[17px] font-bold text-deep-blue sm:text-[18px]"
          >
            Applied Candidates
            <span className="ml-1.5 text-[14px] font-medium text-[#98A2B3]">
              ({candidates.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          {candidates.map((candidate) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              onView={onView}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCandidatesModal;
