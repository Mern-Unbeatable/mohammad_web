/* ---------- Routes ---------- */

export const JOB_BASE = "/supplier/recruitment";
export const MY_JOBS_PATH = `${JOB_BASE}/my-jobs`;
export const CREATE_JOB_PATH = `${JOB_BASE}/create`;
export const jobDetailPath = (id) => `${JOB_BASE}/${id}`;
export const editJobPath = (id) => `${JOB_BASE}/${id}/edit`;

/* ---------- Public job posts ---------- */

/** `activeView` for the header actions. */
export const RECRUITMENT_VIEW = { BROWSE: "browse", MINE: "mine" };

/** Divisible by the 2- and 3-column grid so pages have no gaps. */
export const PUBLIC_JOBS_PAGE_SIZE = 6;

export const VIEW_MODE_STORAGE_KEY = "supplier.recruitment.publicJobs.viewMode";

export const SEARCH_DEBOUNCE_MS = 350;

/* ---------- My applications ---------- */

export const MY_APPLICATIONS_PAGE_SIZE = 20;

/* ---------- Header ---------- */

export const RECRUITMENT_TITLE = "Recruitment";
export const RECRUITMENT_SUBTITLE =
  "Find your next laboratory-industry role or discover qualified candidates.";
