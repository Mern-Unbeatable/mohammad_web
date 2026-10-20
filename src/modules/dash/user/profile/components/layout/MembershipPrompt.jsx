import { Link } from "react-router";
import { SUBSCRIPTION_PATH } from "../../constant/constants";

/** "Want full access?" link under the profile for inactive accounts. */
const MembershipPrompt = () => (
  <p className="mt-6 text-center text-[13px] text-[#64748B]">
    Want full access?{" "}
    <Link to={SUBSCRIPTION_PATH} className="font-semibold text-primary hover:underline">
      View membership plans
    </Link>
  </p>
);

export default MembershipPrompt;
