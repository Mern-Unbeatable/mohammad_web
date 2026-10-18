import { useCallback, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { CardSkeleton } from "@/components/common/Skeleton";
import ApplicantDetailsModal from "./ApplicantDetailsModal";
import { sortByFirstApplied, toCandidateModel } from "./candidates";

/** Applicant count + list with a details modal; `applications` are API rows. */
const AppliedCandidatesPanel = ({
  applications = [],
  loading = false,
  profilePath,
  description = "Candidates who applied to this role.",
}) => {
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const closeCandidate = useCallback(() => setViewingCandidate(null), []);
  const candidates = useMemo(
    () =>
      sortByFirstApplied(applications).map((app) =>
        toCandidateModel(app, profilePath),
      ),
    [applications, profilePath],
  );

  return (
    <section className="rounded-xl border border-[#E4E7EC] bg-white p-4 lg:flex lg:min-h-0 lg:flex-col">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[18px] font-bold text-deep-blue">
          Applied Candidates
        </h2>
        {!loading ? (
          <span className="text-[13px] font-medium text-[#98A2B3]">
            {candidates.length}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-[13px] text-[#64748B]">{description}</p>

      {loading ? (
        <CardSkeleton variant="candidate" count={3} className="mt-4 space-y-3" />
      ) : candidates.length ? (
        <div className="mt-4 space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3"
            >
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
                  <span className="inline-flex shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary">
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
                onClick={() => setViewingCandidate(candidate)}
                aria-label={`View ${candidate.name}'s application`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
          <p className="text-[14px] text-[#64748B]">No applications yet.</p>
        </div>
      )}

      <ApplicantDetailsModal
        application={viewingCandidate}
        onClose={closeCandidate}
      />
    </section>
  );
};

export default AppliedCandidatesPanel;
