/** Map API reports onto admin table / detail UI props. */

const STATUS_LABEL = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

const STATUS_API = {
  all: undefined,
  pending: "pending",
  "under review": "under_review",
  resolved: "resolved",
  Pending: "PENDING",
  "Under Review": "UNDER_REVIEW",
  Resolved: "RESOLVED",
};

const REASON_LABEL = {
  HARASSMENT: "Harassment",
  FRAUD_OR_SCAM: "Fraud or scam",
  SPAM: "Spam",
  MISINFORMATION: "Misinformation",
  HATEFUL_SPEECH: "Hateful speech",
  THREATS_OR_VIOLENCE: "Threats or violence",
  SELF_HARM: "Self-harm",
  EXTREMIST_ORGANIZATIONS: "Extremist organizations",
  GRAPHIC_CONTENT: "Graphic content",
  SEXUAL_CONTENT: "Sexual content",
  FAKE_ACCOUNT: "Fake account",
  CHILD_EXPLOITATION: "Child exploitation",
  RESTRICTED_GOODS: "Restricted goods",
  NONCONSENSUAL_IMAGERY: "Nonconsensual imagery",
};

const TARGET_LABEL = {
  POST: "Post",
  COMMENT: "Comment",
  LISTING: "Listing",
  JOB: "Job",
  GENERAL_POST: "General post",
  USER: "User",
};

const ACTION_LABEL = {
  WARN: "Warn",
  SUSPEND: "Suspend",
  BAN: "Ban",
  REMOVE_CONTENT: "Remove content",
  DISMISS: "Dismiss",
};

export const statusFilterToApi = (value) => STATUS_API[value];
export const statusLabelToApi = (label) => STATUS_API[label];

const initialsFromName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export function formatReportDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
}

export function formatDateTime(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toPersonModel(person) {
  if (!person) {
    return {
      id: null,
      name: "Unknown",
      title: "Member",
      company: "—",
      country: "",
      email: "",
      initials: "U",
      avatar: null,
      status: "Active",
      warnings: 0,
      totalReports: 0,
    };
  }

  const name =
    person.name ||
    [person.firstName, person.lastName].filter(Boolean).join(" ") ||
    person.email ||
    "Unknown";

  const statusLabel =
    person.status === "SUSPENDED"
      ? "Suspend"
      : person.status === "BANNED"
        ? "Banned"
        : "Active";

  return {
    id: person.id,
    name,
    title: person.title || "Lab Unity Member",
    company: person.company || "—",
    country: person.country || person.location || "",
    email: person.email || "",
    initials: person.initials || initialsFromName(name),
    avatar: person.avatar || null,
    status: statusLabel,
    warnings: person.warnings ?? 0,
    totalReports: person.warnings ?? 0,
    badge: null,
  };
}

export function toReportRowModel(report) {
  if (!report) return null;

  const reporter = toPersonModel(report.reporter);
  const reportedUser = toPersonModel(report.reportedUser);

  return {
    id: report.id,
    reportedBy: reporter.name,
    reportedItem: report.targetSnippet || report.reasonDetail || "—",
    type: TARGET_LABEL[report.targetType] || report.targetType,
    reason: REASON_LABEL[report.reason] || report.reason,
    reportedUser: reportedUser.name,
    reportCount: reportedUser.warnings || 0,
    reportedDate: formatReportDate(report.createdAt),
    status: STATUS_LABEL[report.status] || report.status,
    raw: report,
  };
}

export function toReportDetailModel(report) {
  if (!report) return null;

  const reporter = toPersonModel(report.reporter);
  const reportedUser = toPersonModel(report.reportedUser);

  const moderationCases = (report.moderationLogs || []).map((log) => ({
    id: log.id,
    category: ACTION_LABEL[log.action] || log.action,
    snippet: log.note || report.targetSnippet || "—",
    date: formatDateTime(log.createdAt),
  }));

  return {
    id: report.id,
    reason: REASON_LABEL[report.reason] || report.reason,
    reasonDetail:
      report.reasonDetail ||
      report.targetSnippet ||
      "No additional detail provided.",
    status: STATUS_LABEL[report.status] || report.status,
    targetType: TARGET_LABEL[report.targetType] || report.targetType,
    targetSnippet: report.targetSnippet || "",
    reporter,
    reportedUser: {
      ...reportedUser,
      totalReports: reportedUser.warnings || moderationCases.length || 0,
      moderationCases,
    },
    moderationCases,
    raw: report,
  };
}

export function toStatCards(stats) {
  return [
    {
      id: "total",
      label: "Total Reports",
      value: String(stats?.total ?? 0),
      tone: "blue",
    },
    {
      id: "pending",
      label: "Pending Reports",
      value: String(stats?.pending ?? 0),
      tone: "orange",
    },
    {
      id: "review",
      label: "Under Review",
      value: String(stats?.review ?? 0),
      tone: "blue",
    },
    {
      id: "resolved",
      label: "Resolved Reports",
      value: String(stats?.resolved ?? 0),
      tone: "green",
    },
  ];
}
