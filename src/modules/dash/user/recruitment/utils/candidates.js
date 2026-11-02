import { formatPostedAgo } from "@/features/dash/user/recruitment/recruitmentMappers";

const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

/** `profilePath(applicantId)` builds the "View full profile" link. */
export const toCandidateModel = (
  app,
  profilePath = (id) => `/contacts/${id}`,
) => {
  const applicant = app.applicant || {};
  const ago = formatPostedAgo(app.appliedAt || app.createdAt).replace(
    /^Posted /,
    "",
  );
  return {
    ...app,
    applicant,
    name:
      applicant.name ||
      [applicant.firstName, applicant.lastName].filter(Boolean).join(" ") ||
      applicant.email ||
      "Applicant",
    status: app.status || "APPLIED",
    appliedLabel: ago ? `Applied ${ago}` : "",
    appliedAgo: capitalize(ago),
    profileHref: applicant.id ? profilePath(applicant.id) : null,
  };
};

const STATUS_PILL_COLORS = {
  APPLIED: "bg-secondary text-primary",
  REVIEWED: "bg-[#FFFAEB] text-[#B54708]",
  ACCEPTED: "bg-[#ECFDF3] text-[#067647]",
  REJECTED: "bg-[#FEF3F2] text-[#D92D20]",
  CANCELLED: "bg-[#F2F4F7] text-[#475467]",
};

/** Pill classes for a job application status. */
export const applicationStatusClass = (status) =>
  `inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
    STATUS_PILL_COLORS[status] || STATUS_PILL_COLORS.APPLIED
  }`;

const appliedTime = (app) =>
  new Date(app.appliedAt || app.createdAt).getTime() || 0;

/** First applicant at the top. */
export const sortByFirstApplied = (rows) =>
  [...rows].sort((a, b) => appliedTime(a) - appliedTime(b));
