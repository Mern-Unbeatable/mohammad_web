import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

/* ---------- Routes ---------- */

export const JOB_BASE = "/supplier/recruitment";
export const MY_JOBS_PATH = `${JOB_BASE}/my-jobs`;
export const CREATE_JOB_PATH = `${JOB_BASE}/create`;
export const jobDetailPath = (id) => `${JOB_BASE}/${id}`;
export const editJobPath = (id) => `${JOB_BASE}/${id}/edit`;

/* ---------- Lists ---------- */

/** `activeView` for the header actions. */
export const RECRUITMENT_VIEW = { BROWSE: "browse", MINE: "mine" };

export const JOBS_PAGE_SIZE = LIST_PAGE_SIZE;
export const SEARCH_DEBOUNCE_MS = 350;
export const DEFAULT_LEVEL = "All";
export const DEFAULT_STATUS_FILTER = "all";

export const RECRUITMENT_TITLE = "Recruitment";
export const RECRUITMENT_SUBTITLE =
  "Find your next laboratory-industry role or discover qualified candidates.";
