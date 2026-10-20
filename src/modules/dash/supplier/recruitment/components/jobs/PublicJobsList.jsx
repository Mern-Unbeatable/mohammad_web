import { CardSkeleton } from "@/components/loader";
import JobCard from "@/components/data-display/JobCard/JobCard";
import JobsEmptyState from "./JobsEmptyState";
import { JOBS_PAGE_SIZE, jobDetailPath } from "../../constant/constants";

/** Public job cards; the first card on page 1 is highlighted. */
const PublicJobsList = ({ loading, items, page }) => {
  if (loading) return <CardSkeleton variant="job" count={JOBS_PAGE_SIZE} className="space-y-4" />;

  if (!items.length) {
    return (
      <JobsEmptyState
        dashed
        title="No jobs found"
        description="Try a different search or level filter."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((job, index) => (
        <JobCard
          key={job.id}
          job={job}
          highlighted={index === 0 && page === 1}
          detailHref={jobDetailPath(job.id)}
        />
      ))}
    </div>
  );
};

export default PublicJobsList;
