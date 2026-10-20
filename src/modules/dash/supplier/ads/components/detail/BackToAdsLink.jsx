import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { ADS_PATH } from "../../constant/constants";

const BackToAdsLink = () => (
  <Link
    to={ADS_PATH}
    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary sm:text-[14px]"
  >
    <ChevronLeft className="h-4 w-4" />
    Back to Selection
  </Link>
);

export default BackToAdsLink;
