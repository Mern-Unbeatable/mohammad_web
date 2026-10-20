/** One submitted report: reason · target type, snippet, date and status. */
const ReportRow = ({ report }) => (
  <li className="px-5 py-3.5 sm:px-6">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-deep-blue">
          {report.reason}
          <span className="font-normal text-[#64748B]"> · {report.targetType}</span>
        </p>
        {report.targetSnippet ? (
          <p className="mt-1 line-clamp-2 text-[12px] text-[#64748B]">{report.targetSnippet}</p>
        ) : null}
        <p className="mt-1 text-[11px] text-[#98A2B3]">{report.reportedDate}</p>
      </div>
      <span className="shrink-0 rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#475467]">
        {report.status}
      </span>
    </div>
  </li>
);

export default ReportRow;
