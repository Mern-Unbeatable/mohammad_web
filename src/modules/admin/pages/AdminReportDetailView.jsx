import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronLeft,
  History,
  Shield,
  Trash2,
  User,
  UserX,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import { ReportDetailSkeleton } from "@/components/common/Skeleton";
import ModerationHistoryModal from "@/modules/admin/components/ModerationHistoryModal";
import ReasonModal from "@/modules/admin/components/ReasonModal";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import {
  fetchReportDetails,
  clearSelectedReport,
  moderateReport,
  updateReportStatus,
} from "@/features/admin/reports";
import { toReportDetailModel } from "@/features/admin/reports/reportsMappers";

const ModerationAction = ({ icon: Icon, label, tone, onClick, disabled }) => {
  const tones = {
    red: "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]",
    amber: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]",
    orange: "border-[#FED7AA] bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FFEDD5]",
    pink: "border-pink-secondary bg-pink-secondary/30 text-pink-light hover:bg-pink-secondary/50",
    green:
      "border-green-secondary bg-green-secondary text-green-primary hover:opacity-90",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-5 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      <Icon className="h-6 w-6" strokeWidth={1.8} />
      <span className="text-[12px] font-semibold leading-snug">{label}</span>
    </button>
  );
};

const PersonCard = ({ person, variant, onProfile, onAudit }) => (
  <Card className="h-full">
    <div className="flex items-start justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
      <div className="flex items-center gap-3">
        <Avatar
          src={person.avatar}
          initials={person.initials}
          alt={person.name}
          size="md"
        />
        <div>
          <p className="text-[15px] font-bold text-deep-blue">{person.name}</p>
          <p className="text-[12px] text-[#64748B]">{person.title}</p>
          <p className="text-[12px] text-[#98A2B3]">
            {person.company}
            {person.country ? ` · ${person.country}` : ""}
          </p>
        </div>
      </div>
      {variant === "reporter" && person.badge ? (
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-primary">
          {person.badge}
        </span>
      ) : null}
      {variant === "reported" ? (
        <StatusBadge status={person.status} label={person.status} />
      ) : null}
    </div>

    {variant === "reported" ? (
      <div className="border-b border-[#E4E7EC] px-5 py-3">
        <span className="inline-flex rounded-md bg-pink-secondary px-2.5 py-1 text-[11px] font-semibold text-pink-light">
          {person.warnings || 0} Warnings
        </span>
        <p className="mt-2 text-[12px] text-[#64748B]">
          {person.totalReports || 0} related moderation records
        </p>
      </div>
    ) : null}

    <div className="flex flex-col gap-2 p-4 sm:flex-row">
      {variant === "reporter" ? (
        <button
          type="button"
          onClick={onProfile}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB]"
        >
          <User className="h-4 w-4" />
          View Reporter Profile
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onProfile}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB]"
          >
            User Profile
          </button>
          <button
            type="button"
            onClick={onAudit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-pink-secondary bg-pink-secondary/20 px-4 py-2.5 text-[13px] font-semibold text-pink-light hover:bg-pink-secondary/40"
          >
            <History className="h-4 w-4" />
            Audit History
          </button>
        </>
      )}
    </div>
  </Card>
);

const AdminReportDetailView = () => {
  const { reportId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedReport, selectedReportLoading, actionLoading, error } =
    useSelector((state) => state.adminReports);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (reportId) {
      dispatch(fetchReportDetails(reportId));
    }
    return () => {
      dispatch(clearSelectedReport());
    };
  }, [dispatch, reportId]);

  const report = useMemo(
    () => toReportDetailModel(selectedReport),
    [selectedReport],
  );

  const runModerate = async (action, note = "") => {
    const result = await dispatch(
      moderateReport({ reportId, action, note }),
    );
    if (moderateReport.fulfilled.match(result)) {
      toast.success("Moderation action applied");
      navigate("/admin/reports");
      return;
    }
    toast.error(result.payload || "Failed to moderate report");
  };

  const openReasonModal = (action) => {
    setPendingAction(action);
    setReasonOpen(true);
  };

  const handleResolve = async () => {
    const result = await dispatch(
      updateReportStatus({ reportId, status: "RESOLVED" }),
    );
    if (updateReportStatus.fulfilled.match(result)) {
      toast.success("Report marked resolved");
      navigate("/admin/reports");
      return;
    }
    toast.error(result.payload || "Failed to resolve report");
  };

  if (selectedReportLoading) {
    return (
      <PanelPage>
        <ReportDetailSkeleton />
      </PanelPage>
    );
  }

  if ((error && !selectedReport) || !report) {
    return <Navigate to="/admin/reports" replace />;
  }

  const reportedUserWithCases = {
    ...report.reportedUser,
    moderationCases: report.moderationCases,
  };

  return (
    <PanelPage>
      <Link
        to="/admin/reports"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Reports
      </Link>

      <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-5 py-4">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#EA580C]">
          Report reason: {report.reason}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#9A3412]">
          &ldquo;{report.reasonDetail}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PersonCard
          person={report.reporter}
          variant="reporter"
          onProfile={() => {
            if (report.reporter.id) {
              navigate(`/admin/users/${report.reporter.id}`);
            }
          }}
        />
        <PersonCard
          person={report.reportedUser}
          variant="reported"
          onProfile={() => {
            if (report.reportedUser.id) {
              navigate(`/admin/users/${report.reportedUser.id}`);
            } else {
              navigate("/admin/users");
            }
          }}
          onAudit={() => setHistoryOpen(true)}
        />
      </div>

      {report.targetSnippet ? (
        <Card className="p-5 sm:p-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            Reported {report.targetType}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">
            &ldquo;{report.targetSnippet}&rdquo;
          </p>
        </Card>
      ) : null}

      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-[15px] font-bold text-deep-blue">
              Admin moderation decision actions
            </h2>
            <p className="text-[12px] text-[#64748B]">
              Choose appropriate measure based on evidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <ModerationAction
            icon={Trash2}
            label="Remove Content"
            tone="red"
            disabled={actionLoading}
            onClick={() => runModerate("REMOVE_CONTENT")}
          />
          <ModerationAction
            icon={AlertTriangle}
            label="Warn User"
            tone="amber"
            disabled={actionLoading}
            onClick={() => runModerate("WARN")}
          />
          <ModerationAction
            icon={UserX}
            label="Suspend User"
            tone="orange"
            disabled={actionLoading}
            onClick={() => openReasonModal("SUSPEND")}
          />
          <ModerationAction
            icon={Ban}
            label="Ban User"
            tone="pink"
            disabled={actionLoading}
            onClick={() => openReasonModal("BAN")}
          />
          <ModerationAction
            icon={CheckCircle2}
            label="Mark Resolved"
            tone="green"
            disabled={actionLoading}
            onClick={handleResolve}
          />
        </div>
      </Card>

      <ModerationHistoryModal
        open={historyOpen}
        user={reportedUserWithCases}
        onClose={() => setHistoryOpen(false)}
        onOpenCase={() => setHistoryOpen(false)}
      />

      <ReasonModal
        open={reasonOpen}
        title={pendingAction === "BAN" ? "Ban User" : "Suspend User"}
        submitLabel={pendingAction === "BAN" ? "Ban" : "Suspend"}
        placeholder="Add a moderation note…"
        onClose={() => {
          setReasonOpen(false);
          setPendingAction(null);
        }}
        onConfirm={(note) => {
          if (pendingAction) {
            runModerate(pendingAction, note);
          }
          setPendingAction(null);
        }}
      />
    </PanelPage>
  );
};

export default AdminReportDetailView;
