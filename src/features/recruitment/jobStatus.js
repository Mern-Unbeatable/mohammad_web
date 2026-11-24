/** Job posting statuses, mirroring the server `JobStatus` enum. */
export const JOB_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  REMOVED: "REMOVED",
};

export const JOB_STATUS_LABEL = {
  [JOB_STATUS.OPEN]: "Open",
  [JOB_STATUS.CLOSED]: "Closed",
  [JOB_STATUS.REMOVED]: "Removed by admin",
};

/** Status tabs on "My Job Posts"; `all` sends no status filter. */
export const MY_JOB_STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: JOB_STATUS.OPEN, label: "Open" },
  { id: JOB_STATUS.CLOSED, label: "Closed" },
];

/** Tabs on "My Applications"; ids are the server `status` filter. */
export const MY_APPLICATION_FILTERS = [
  { id: "applied", label: "Applied" },
  { id: "cancelled", label: "Cancelled" },
];

export const isJobOpen = (job) => (job?.status ?? JOB_STATUS.OPEN) === JOB_STATUS.OPEN;

/** Detail-page notice for a job that no longer accepts applications. */
export const jobClosedNotice = (status, isOwner) => {
  if (status === JOB_STATUS.REMOVED) {
    return isOwner
      ? "An administrator removed this job post. It is hidden from other members."
      : "This job post is no longer available.";
  }
  return isOwner
    ? "This job is closed and hidden from Public Job Posts. Reopen it from My Job Posts to accept applications again."
    : "This position is no longer accepting applications.";
};
