import { Link } from "react-router";
import { Briefcase, List, Plus } from "lucide-react";

const actionBtn =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors";

const SupplierRecruitmentActions = ({
  activeView = "browse",
  browseHref = "/supplier/recruitment",
  myJobsHref = "/supplier/recruitment/my-jobs",
  createHref = "/supplier/recruitment/create",
}) => (
  <div className="flex flex-wrap gap-2">
    <Link
      to={browseHref}
      className={`${actionBtn} ${
        activeView === "browse"
          ? "bg-[#E8F3FB] text-primary"
          : "border border-primary/30 text-primary hover:bg-[#E8F3FB]"
      }`}
    >
      <Briefcase className="h-3.5 w-3.5" />
      Public Job Posts
    </Link>
    <Link
      to={myJobsHref}
      className={`${actionBtn} ${
        activeView === "mine"
          ? "bg-green-secondary text-green-primary"
          : "border border-green-primary/30 text-green-primary hover:bg-green-secondary"
      }`}
    >
      <List className="h-3.5 w-3.5" />
      My Job Posts
    </Link>
    <Link
      to={createHref}
      className={`${actionBtn} bg-primary text-white hover:bg-[#066BB0]`}
    >
      <Plus className="h-3.5 w-3.5" />
      Post Job
    </Link>
  </div>
);

export default SupplierRecruitmentActions;
