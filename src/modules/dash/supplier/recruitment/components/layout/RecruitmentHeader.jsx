import { useSelector } from "react-redux";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import { RecruitmentToolbar } from "@/modules/dash/user/recruitment";
import { selectSupplierNewApplicationTotal } from "@/features/dash/supplier/recruitment";
import RecruitmentActions from "./RecruitmentActions";
import { JOB_BASE, RECRUITMENT_SUBTITLE, RECRUITMENT_TITLE } from "../../constant/constants";

/**
 * Page header with the view actions, then the shared search toolbar.
 * Remaining props (filters, handlers) go to `RecruitmentToolbar`.
 */
const RecruitmentHeader = ({ activeView, ...toolbarProps }) => {
  const newApplications = useSelector(selectSupplierNewApplicationTotal);

  return (
    <>
      <PanelPageHeader
        title={RECRUITMENT_TITLE}
        subtitle={RECRUITMENT_SUBTITLE}
        action={<RecruitmentActions activeView={activeView} newApplications={newApplications} />}
      />

      <RecruitmentToolbar
        {...toolbarProps}
        basePath={JOB_BASE}
        showTitle={false}
        showActions={false}
      />
    </>
  );
};

export default RecruitmentHeader;
