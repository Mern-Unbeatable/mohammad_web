import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import { RecruitmentToolbar } from "@/modules/dash/user/recruitment";
import RecruitmentActions from "./RecruitmentActions";
import { JOB_BASE, RECRUITMENT_SUBTITLE, RECRUITMENT_TITLE } from "../../constant/constants";

/** Page header with the view actions, then the shared search + level toolbar. */
const RecruitmentHeader = ({ activeView, query, onQueryChange, level, onLevelChange }) => (
  <>
    <PanelPageHeader
      title={RECRUITMENT_TITLE}
      subtitle={RECRUITMENT_SUBTITLE}
      action={<RecruitmentActions activeView={activeView} />}
    />

    <RecruitmentToolbar
      query={query}
      onQueryChange={onQueryChange}
      level={level}
      onLevelChange={onLevelChange}
      basePath={JOB_BASE}
      showTitle={false}
      showActions={false}
    />
  </>
);

export default RecruitmentHeader;
