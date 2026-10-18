import { Eye } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { applicationStatusClass } from "./candidates";

/** One applicant row; `candidate` comes from `toCandidateModel`. */
const CandidateRow = ({ candidate, onView }) => (
  <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
    <Avatar
      src={candidate.applicant.avatar}
      alt={candidate.name}
      size="sm"
      className="self-start"
    />
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-1.5 text-[15px] font-semibold text-deep-blue">
        <span className="truncate">{candidate.name}</span>
        {candidate.isNew ? (
          <span className="shrink-0 rounded-full bg-[#CC1016] px-1.5 py-px text-[10px] font-bold uppercase text-white">
            New
          </span>
        ) : null}
      </p>
      <div className="mt-1 flex min-w-0 items-center gap-2">
        <span className={applicationStatusClass(candidate.status)}>
          {candidate.status}
        </span>
        <span
          className="truncate whitespace-nowrap text-[11px] text-[#98A2B3]"
          title={candidate.appliedLabel}
        >
          {candidate.appliedAgo}
        </span>
      </div>
    </div>
    <button
      type="button"
      onClick={() => onView(candidate)}
      aria-label={`View ${candidate.name}'s application`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
    >
      <Eye className="h-3.5 w-3.5" />
      View
    </button>
  </div>
);

export default CandidateRow;
