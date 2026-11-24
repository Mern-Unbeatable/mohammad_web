import { Navigate } from "react-router";
import { ReportDetailSkeleton } from "@/components/loader";
import ModerationHistoryModal from "@/components/modals/admin/ModerationHistoryModal";
import ReasonModal from "@/components/modals/admin/ReasonModal";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import CaseSummary from "../components/detail/CaseSummary";
import PersonCard from "../components/detail/PersonCard";
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
        <CaseSummary report={report} />

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <PersonCard
            person={report.reportedUser}
            variant="reported"
            onProfile={detail.openReportedUser}
            onAudit={history.show}
          />
          <PersonCard
            person={report.reporter}
            variant="reporter"
            onProfile={detail.openReporter}
          />
          <DecisionActions disabled={detail.busy} onDecide={detail.decide} />
        </aside>
      </div>

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
