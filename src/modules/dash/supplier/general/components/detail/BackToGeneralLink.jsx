import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { GENERAL_PATH } from "../../constant/constants";

const BackToGeneralLink = () => (
  <Link
    to={GENERAL_PATH}
    className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
  >
    <ChevronLeft className="h-4 w-4" />
    Back to General
  </Link>
);

export default BackToGeneralLink;
