import BackLink from "@/components/layout/BackLink";
import { GENERAL_PATH } from "../../constant/constants";

const BackToGeneralLink = () => (
  <BackLink to={GENERAL_PATH} className="mb-5">
    Back to General
  </BackLink>
);

export default BackToGeneralLink;
