import { AppliedCandidatesPanel, JobPosterCard } from "@/modules/dash/user/recruitment";
import { adminProfilePath } from "../../constant/constants";

/** Poster card and applicants, both linking to admin user pages. */
const JobSidebar = ({ owner, applications, loading }) => (
  <aside className="flex flex-col gap-4">
    <div className="shrink-0">
      <JobPosterCard owner={owner} profilePath={adminProfilePath} />
    </div>
    <AppliedCandidatesPanel
      applications={applications}
      loading={loading}
      profilePath={adminProfilePath}
      description="Everyone who applied to this job."
    />
  </aside>
);

export default JobSidebar;
