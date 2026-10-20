import Card from "@/components/ui/Card";
import { CardSkeleton } from "@/components/common/Skeleton";
import ReportRow from "./ReportRow";

/** Sidebar card listing the reports the user has submitted. */
const MyReportsCard = ({ reports = [], loading = false }) => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <h2 className="text-[16px] font-bold text-deep-blue">My reports</h2>
      <p className="mt-1 text-[13px] text-[#64748B]">Reports you have submitted for review.</p>
    </div>

    {loading && !reports.length ? (
      <CardSkeleton
        variant="reportRow"
        count={3}
        as="ul"
        className="divide-y divide-[#E4E7EC]"
      />
    ) : reports.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {reports.map((report) => (
          <ReportRow key={report.id} report={report} />
        ))}
      </ul>
    ) : (
      <p className="px-5 py-8 text-center text-[13px] text-[#64748B] sm:px-6">
        You have not submitted any reports yet.
      </p>
    )}
  </Card>
);

export default MyReportsCard;
