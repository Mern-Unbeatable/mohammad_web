import { useCallback, useMemo, useState } from "react";
import { CardSkeleton } from "@/components/loader";
import AllCandidatesModal from "./AllCandidatesModal";
import ApplicantDetailsModal from "./ApplicantDetailsModal";
import CandidateRow from "./CandidateRow";
import { sortByFirstApplied, toCandidateModel } from "../../utils/candidates";

const PREVIEW_COUNT = 6;

/** Applicant count + list with a details modal; `applications` are API rows. */
const AppliedCandidatesPanel = ({
  applications = [],
  loading = false,
  profilePath,
  description = "Candidates who applied to this role.",
}) => {
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const closeCandidate = useCallback(() => setViewingCandidate(null), []);
  const closeAll = useCallback(() => setShowAll(false), []);
  const candidates = useMemo(
    () =>
      sortByFirstApplied(applications).map((app) =>
        toCandidateModel(app, profilePath),
      ),
    [applications, profilePath],
  );
  const preview = candidates.slice(0, PREVIEW_COUNT);
  const hiddenCount = candidates.length - preview.length;

  return (
    <section className="rounded-xl border border-[#E4E7EC] bg-white p-4">
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
        <>
          <div className="mt-4 space-y-3">
            {preview.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                onView={setViewingCandidate}
              />
            ))}
          </div>
          {hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#066BB0]"
            >
              See all {candidates.length} candidates (+{hiddenCount} more)
            </button>
          ) : null}
        </>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
          <p className="text-[14px] text-[#64748B]">No applications yet.</p>
        </div>
      )}

      <AllCandidatesModal
        open={showAll}
        candidates={candidates}
        onClose={closeAll}
        onView={setViewingCandidate}
        escapePaused={Boolean(viewingCandidate)}
      />
      <ApplicantDetailsModal
        application={viewingCandidate}
        onClose={closeCandidate}
      />
    </section>
  );
};

export default AppliedCandidatesPanel;
