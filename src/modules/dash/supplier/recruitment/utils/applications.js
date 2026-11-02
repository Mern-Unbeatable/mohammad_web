import { formatPostedAgo, toJobCardModel } from "@/features/dash/supplier/recruitment";

/** API application → row model for `MyApplicationsSection`. */
export const toApplicationModel = (app) => {
  const job = app.job ? toJobCardModel(app.job) : null;
  return {
    id: app.id,
    status: app.status || "PENDING",
    appliedAt: formatPostedAgo(app.appliedAt || app.createdAt).replace(
      /^Posted /,
      "Applied ",
    ),
    coverLetter: app.coverLetter || "",
    job,
    jobId: job?.id || app.jobId,
  };
};
