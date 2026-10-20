import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import { CardSkeleton } from "@/components/common/Skeleton";
import { MY_APPLICATION_FILTERS } from "@/shared/constants/jobStatus";
import JobsSectionHeader from "../jobs/JobsSectionHeader";
import { jobCount } from "../../utils/jobsSection";
import ApplicationRow from "./ApplicationRow";

/** "My Applications" section: header with Applied / Cancelled tabs and the rows. */
const MyApplicationsSection = ({
  items,
  total,
  loading,
  filter,
  onFilterChange,
  withdrawing,
  onWithdraw,
}) => (
  <section className="mt-10">
    <div className="mb-4">
      <JobsSectionHeader
        title="My Applications"
        description="Roles you have applied to across the network."
        count={jobCount(loading, total)}
        itemName="application"
      >
        <SegmentedTabs
          tabs={MY_APPLICATION_FILTERS}
          activeTab={filter}
          onTabChange={onFilterChange}
          standalone
          ariaLabel="Filter my applications by status"
          className="border border-[#E4E7EC]"
        />
      </JobsSectionHeader>
    </div>

    {loading ? (
      <CardSkeleton variant="application" count={3} className="space-y-3" />
    ) : items.length ? (
      <div className="space-y-3">
        {items.map((app) => (
          <ApplicationRow
            key={app.id}
            app={app}
            withdrawing={withdrawing}
            onWithdraw={onWithdraw}
          />
        ))}
      </div>
    ) : (
      <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
        <p className="text-[14px] text-[#64748B]">
          {filter === "cancelled"
            ? "You have no cancelled applications."
            : "You have not applied to any jobs yet."}
        </p>
      </div>
    )}
  </section>
);

export default MyApplicationsSection;
