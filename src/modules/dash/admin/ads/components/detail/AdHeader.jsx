import { RefreshCw } from "lucide-react";
import { STATUS_PILL } from "../../constant/constants";

/** Company initials, name, category, location and the status pill. */
const AdHeader = ({ ad }) => (
  <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-secondary text-[13px] font-bold text-green-primary">
        {ad.companyInitials}
      </div>
      <div>
        <p className="text-[15px] font-bold text-deep-blue">{ad.company}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            {ad.category}
          </span>
          <span>{ad.location}</span>
        </div>
      </div>
    </div>
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        STATUS_PILL[ad.status] || STATUS_PILL.Expired
      }`}
    >
      {ad.status}
    </span>
  </div>
);

export default AdHeader;
