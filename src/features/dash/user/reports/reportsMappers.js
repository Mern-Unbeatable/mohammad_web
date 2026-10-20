/** Map user-filed reports onto list UI props. */

const STATUS_LABEL = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

const REASON_LABEL = {
  HARASSMENT: "Harassment",
  FRAUD_OR_SCAM: "Fraud or scam",
  SPAM: "Spam",
  MISINFORMATION: "Misinformation",
  HATEFUL_SPEECH: "Hateful speech",
  THREATS_OR_VIOLENCE: "Threats or violence",
  SELF_HARM: "Self-harm",
  EXTREMIST_ORGANIZATIONS: "Dangerous or extremist organizations",
  GRAPHIC_CONTENT: "Graphic content",
  SEXUAL_CONTENT: "Sexual content",
  FAKE_ACCOUNT: "Fake account",
  CHILD_EXPLOITATION: "Child exploitation",
  RESTRICTED_GOODS: "Restricted goods and services",
  NONCONSENSUAL_IMAGERY: "Nonconsensual intimate imagery",
};

const REASON_API = Object.fromEntries(
  Object.entries(REASON_LABEL).map(([api, label]) => [label, api]),
);

/** Map UI report reason label → API enum. */
export function reasonLabelToApi(label) {
  if (!label) return null;
  if (REASON_API[label]) return REASON_API[label];
  const upper = String(label).toUpperCase().replace(/\s+/g, "_");
  return REASON_LABEL[upper] ? upper : null;
}

const TARGET_LABEL = {
  POST: "Post",
  COMMENT: "Comment",
  LISTING: "Listing",
  JOB: "Job",
  GENERAL_POST: "General post",
  USER: "User",
};

export function formatReportDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
}

export function toMyReportModel(report) {
  if (!report) return null;
  return {
    id: report.id,
    targetType: TARGET_LABEL[report.targetType] || report.targetType,
    reason: REASON_LABEL[report.reason] || report.reason,
    reasonDetail: report.reasonDetail || "",
    targetSnippet: report.targetSnippet || "",
    status: STATUS_LABEL[report.status] || report.status,
    reportedDate: formatReportDate(report.createdAt),
    raw: report,
  };
}
