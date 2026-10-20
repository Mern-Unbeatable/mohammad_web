import { Link } from "react-router";
import { Briefcase, List } from "lucide-react";
import CountBadge from "@/components/ui/CountBadge";
import { JOB_BASE, MY_JOBS_PATH, RECRUITMENT_VIEW } from "../../constant/constants";

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors";

/** Public Job Posts / My Job Posts tabs; My Job Posts shows unseen applications. */
const RecruitmentActions = ({ activeView = RECRUITMENT_VIEW.BROWSE, newApplications = 0 }) => (
  <div className="flex flex-wrap gap-2">
    <Link
      to={JOB_BASE}
      className={`${actionBtn} ${
        activeView === RECRUITMENT_VIEW.BROWSE
          ? "bg-[#E8F3FB] text-primary"
          : "border border-primary/30 text-primary hover:bg-[#E8F3FB]"
      }`}
    >
      <Briefcase className="h-3.5 w-3.5" />
      Public Job Posts
    </Link>
    <Link
      to={MY_JOBS_PATH}
      aria-label={
        newApplications
          ? `My Job Posts, ${newApplications} new ${newApplications === 1 ? "application" : "applications"}`
          : undefined
      }
      className={`relative ${actionBtn} ${
        activeView === RECRUITMENT_VIEW.MINE
          ? "bg-green-secondary text-green-primary"
          : "border border-green-primary/30 text-green-primary hover:bg-green-secondary"
      }`}
    >
      <List className="h-3.5 w-3.5" />
      My Job Posts
      <CountBadge count={newApplications} className="absolute -right-2 -top-2" />
    </Link>
  </div>
);

export default RecruitmentActions;
