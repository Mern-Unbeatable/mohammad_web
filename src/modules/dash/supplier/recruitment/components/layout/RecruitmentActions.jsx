import { Link } from "react-router";
import { Briefcase, List, Plus } from "lucide-react";
import {
  CREATE_JOB_PATH,
  JOB_BASE,
  MY_JOBS_PATH,
  RECRUITMENT_VIEW,
} from "../../constant/constants";

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors";

/** Public Job Posts / My Job Posts tabs and the Post Job button. */
const RecruitmentActions = ({ activeView = RECRUITMENT_VIEW.BROWSE }) => (
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
      className={`${actionBtn} ${
        activeView === RECRUITMENT_VIEW.MINE
          ? "bg-green-secondary text-green-primary"
          : "border border-green-primary/30 text-green-primary hover:bg-green-secondary"
      }`}
    >
      <List className="h-3.5 w-3.5" />
      My Job Posts
    </Link>
    <Link to={CREATE_JOB_PATH} className={`${actionBtn} bg-primary text-white hover:bg-[#066BB0]`}>
      <Plus className="h-3.5 w-3.5" />
      Post Job
    </Link>
  </div>
);

export default RecruitmentActions;
