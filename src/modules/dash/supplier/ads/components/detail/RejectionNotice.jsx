import { AlertTriangle } from "lucide-react";
import { DEFAULT_REJECTION } from "../../constant/constants";

const RejectionNotice = ({ reason }) => (
  <div className="flex gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5 sm:px-5">
    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" />
    <p className="text-[13px] leading-relaxed text-[#991B1B] sm:text-[14px]">
      {reason || DEFAULT_REJECTION}
    </p>
  </div>
);

export default RejectionNotice;
