import { formatPostedAgo } from "@/features/user/recruitment/recruitmentMappers";

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

const appliedTime = (app) =>
  new Date(app.appliedAt || app.createdAt).getTime() || 0;

/** First applicant at the top. */
export const sortByFirstApplied = (rows) =>
  [...rows].sort((a, b) => appliedTime(a) - appliedTime(b));
