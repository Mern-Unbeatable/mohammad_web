import { Navigate } from "react-router";
import { ReportDetailSkeleton } from "@/components/loader";
import ModerationHistoryModal from "@/components/modals/admin/ModerationHistoryModal";
import ReasonModal from "@/components/modals/admin/ReasonModal";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import ReasonBanner from "../components/detail/ReasonBanner";
import PersonCard from "../components/detail/PersonCard";
import ReportedTarget from "../components/detail/ReportedTarget";
import DecisionActions from "../components/detail/DecisionActions";
import { useAdminReportDetail } from "../hooks/useAdminReportDetail";
import { reasonModalCopy } from "../utils/reports";
import { REPORTS_PATH } from "../constant/constants";

const AdminReportDetailView = () => {
  const detail = useAdminReportDetail();
  const { report, history, reason } = detail;

  if (detail.loading) {
    return (
      <PanelPage>
        <ReportDetailSkeleton />
      </PanelPage>
    );
  }

  if (detail.missing) return <Navigate to={REPORTS_PATH} replace />;

  const copy = reasonModalCopy(reason.action);

  return (
    <PanelPage>
      <PanelBackButton fallback={REPORTS_PATH} />

      <ReasonBanner reason={report.reason} detail={report.reasonDetail} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PersonCard person={report.reporter} variant="reporter" onProfile={detail.openReporter} />
        <PersonCard
          person={report.reportedUser}
          variant="reported"
          onProfile={detail.openReportedUser}
          onAudit={history.show}
        />
      </div>

      {report.targetSnippet ? (
        <ReportedTarget type={report.targetType} snippet={report.targetSnippet} />
      ) : null}

      <DecisionActions disabled={detail.busy} onDecide={detail.decide} />

      <ModerationHistoryModal
        open={history.open}
        user={{ ...report.reportedUser, moderationCases: report.moderationCases }}
        onClose={history.close}
        onOpenCase={history.close}
      />

      <ReasonModal
        open={reason.open}
        title={copy.title}
        submitLabel={copy.submitLabel}
        placeholder="Add a moderation note…"
        onClose={reason.close}
        onConfirm={reason.confirm}
      />
    </PanelPage>
  );
};

export default AdminReportDetailView;
