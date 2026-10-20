import { CardSkeleton } from "@/components/loader";
import JobCard from "@/components/data-display/JobCard/JobCard";
import JobsEmptyState from "./JobsEmptyState";
import { JOBS_PAGE_SIZE, jobDetailPath } from "../../constant/constants";

/** The supplier's job cards with edit, delete and open / close actions. */
const MyJobsList = ({
  loading,
  items,
  page,
  unfiltered,
  deleting,
  togglingId,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) return <CardSkeleton variant="myJob" count={JOBS_PAGE_SIZE} className="space-y-4" />;

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            variant="mine"
            highlighted={index === 0 && page === 1}
            detailHref={jobDetailPath(job.id)}
            onDelete={deleting ? undefined : onDelete}
            onEdit={() => onEdit(job.id)}
            onToggleStatus={onToggleStatus}
            togglingStatus={togglingId === job.id}
          />
        ))
      ) : unfiltered ? (
        <JobsEmptyState
          title="No job posts yet"
          description="Post your first role to reach qualified laboratory professionals."
        />
      ) : (
        <JobsEmptyState
          title="No job posts match these filters"
          description="Try a different search, level or status."
        />
      )}
    </div>
  );
};

export default MyJobsList;
