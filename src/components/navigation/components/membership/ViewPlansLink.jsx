import { Crown } from "lucide-react";
import { Link } from "react-router";
import { SUBSCRIPTION_PATH } from "../../constant/constants";

const ViewPlansLink = ({ onClick }) => (
  <Link
    to={SUBSCRIPTION_PATH}
    onClick={onClick}
    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-primary py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-secondary"
  >
    <Crown aria-hidden className="h-4 w-4" />
    View plans
  </Link>
);

export default ViewPlansLink;
