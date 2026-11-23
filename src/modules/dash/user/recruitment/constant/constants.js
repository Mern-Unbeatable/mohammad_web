/* ---------- Routes ---------- */

export const JOB_BASE = "/recruitment";
export const MY_JOBS_PATH = `${JOB_BASE}/my-jobs`;
export const CREATE_JOB_PATH = `${JOB_BASE}/create`;
export const jobDetailPath = (id) => `${JOB_BASE}/${id}`;
export const editJobPath = (id) => `${JOB_BASE}/${id}/edit`;

/* ---------- Public job posts ---------- */

/** Divisible by the 2- and 3-column grid so pages have no gaps. */
export const PUBLIC_JOBS_PAGE_SIZE = 6;

export const VIEW_MODE = { LIST: "list", GRID: "grid" };
export const VIEW_MODE_STORAGE_KEY = "recruitment.publicJobs.viewMode";

export const SEARCH_DEBOUNCE_MS = 350;

/* ---------- My applications ---------- */

export const MY_APPLICATIONS_PAGE_SIZE = 20;

/** Application statuses the applicant can still withdraw. */
export const CANCELLABLE_APPLICATION_STATUSES = new Set(["APPLIED", "REVIEWED"]);
