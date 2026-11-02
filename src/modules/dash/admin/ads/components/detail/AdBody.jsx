import { Calendar } from "lucide-react";
import RichText from "@/components/data-display/RichText/RichText";
import ErrorBanner from "../common/ErrorBanner";

/** Title, description, image, rejection reason, dates and price. */
const AdBody = ({ ad }) => (
  <div className="space-y-4 px-5 py-5 sm:px-6">
    <div>
      <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[24px]">
        {ad.title}
      </h1>
      <RichText text={ad.description} className="mt-3 text-[14px] leading-relaxed text-[#475467]" />
    </div>

    {ad.image ? (
      <img src={ad.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
    ) : null}

    {ad.rejectionReason ? <ErrorBanner>Rejection reason: {ad.rejectionReason}</ErrorBanner> : null}

    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EC] pt-4 text-[13px] text-[#64748B]">
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-4 w-4" />
        Start Date: {ad.startDate}
      </span>
      <span className="font-semibold text-pink-light">Expiry Date: {ad.expiryDate}</span>
    </div>

    <p className="text-[24px] font-bold text-deep-blue">{ad.price}</p>
  </div>
);

export default AdBody;
