import Card from "@/components/ui/Card";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";

/** Left-rail case content: status, reason, and reported material. */
const CaseSummary = ({ report }) => (
  <div className="min-w-0 space-y-4">
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
            Report case
          </p>
          <h1 className="mt-1 text-[18px] font-bold text-deep-blue sm:text-[20px]">
            {report.reason}
          </h1>
        </div>
        <StatusBadge status={report.status} label={report.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 border-b border-[#E4E7EC] px-5 py-3 text-[13px] sm:grid-cols-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">Type</p>
          <p className="mt-0.5 font-semibold text-deep-blue">{report.targetType}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">Date</p>
          <p className="mt-0.5 font-semibold text-deep-blue">{report.reportedDate}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">Status</p>
          <p className="mt-0.5 font-semibold text-deep-blue">{report.status}</p>
        </div>
      </div>

      <div className="border-b border-[#E4E7EC] bg-[#FFF7ED] px-5 py-4">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#EA580C]">
          Report reason: {report.reason}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#9A3412]">
          &ldquo;{report.reasonDetail}&rdquo;
        </p>
      </div>

      {report.targetSnippet ? (
        <div className="px-5 py-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Reported {report.targetType}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">
            &ldquo;{report.targetSnippet}&rdquo;
          </p>
        </div>
      ) : null}
    </Card>
  </div>
);

export default CaseSummary;
