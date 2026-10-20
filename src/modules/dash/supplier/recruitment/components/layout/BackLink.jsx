import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

const BackLink = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
  >
    <ChevronLeft className="h-4 w-4" />
    {children}
  </Link>
);

export default BackLink;
