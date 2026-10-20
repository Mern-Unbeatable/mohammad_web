import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import {
  clearSelectedReport,
  fetchReportDetails,
  moderateReport,
  toReportDetailModel,
  updateReportStatus,
} from "@/features/dash/admin/reports";
import {
  REPORTS_PATH,
  RESOLVED_API_STATUS,
  USERS_PATH,
  userProfilePath,
} from "../constant/constants";

/** Report detail: load / clear, moderation decisions (some with a note), resolve, audit history. */
export const useAdminReportDetail = () => {
  const { reportId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedReport, selectedReportLoading, actionLoading, error } = useSelector(
    (state) => state.adminReports,
  );

  const [historyOpen, setHistoryOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (reportId) dispatch(fetchReportDetails(reportId));
    return () => {
      dispatch(clearSelectedReport());
    };
  }, [dispatch, reportId]);

  const report = useMemo(() => toReportDetailModel(selectedReport), [selectedReport]);

  const moderate = async (action, note = "") => {
    const result = await dispatch(moderateReport({ reportId, action, note }));
    if (moderateReport.fulfilled.match(result)) {
      toast.success("Moderation action applied");
      navigate(REPORTS_PATH);
      return;
    }
    toast.error(result.payload || "Failed to moderate report");
  };

  const resolve = async () => {
    const result = await dispatch(updateReportStatus({ reportId, status: RESOLVED_API_STATUS }));
    if (updateReportStatus.fulfilled.match(result)) {
      toast.success("Report marked resolved");
      navigate(REPORTS_PATH);
      return;
    }
    toast.error(result.payload || "Failed to resolve report");
  };

  const decide = ({ id, kind }) => {
    if (kind === "resolve") return resolve();
    if (kind === "reason") {
      setPendingAction(id);
      setReasonOpen(true);
      return undefined;
    }
    return moderate(id);
  };

  const openReporter = () => {
    if (report.reporter.id) navigate(userProfilePath(report.reporter.id));
  };

  const openReportedUser = () =>
    navigate(report.reportedUser.id ? userProfilePath(report.reportedUser.id) : USERS_PATH);

  return {
    loading: selectedReportLoading,
    missing: (error && !selectedReport) || !report,
    report,
    busy: actionLoading,
    decide,
    openReporter,
    openReportedUser,
    history: {
      open: historyOpen,
      show: () => setHistoryOpen(true),
      close: () => setHistoryOpen(false),
    },
    reason: {
      open: reasonOpen,
      action: pendingAction,
      close: () => {
        setReasonOpen(false);
        setPendingAction(null);
      },
      confirm: (note) => {
        if (pendingAction) moderate(pendingAction, note);
        setPendingAction(null);
      },
    },
  };
};
