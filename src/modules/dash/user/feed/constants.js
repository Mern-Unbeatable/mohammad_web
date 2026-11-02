/* ---------- Feed list ---------- */

export const FEED_PAGE_SIZE = 20;

export const FEED_FILTERS = [
  { id: "all", label: "All" },
  { id: "questions", label: "Questions" },
  { id: "information", label: "Information" },
  { id: "suppliers", label: "Suppliers" },
];

export const DEFAULT_FEED_FILTER = "all";

/** Feed filter id → API `type` query value; "all" sends no type. */
export const FILTER_TO_API_TYPE = {
  questions: "question",
  information: "information",
  suppliers: "suppliers",
};

/* ---------- Post card ---------- */

export const POST_BADGES = {
  question: { variant: "question", label: "Question" },
  information: { variant: "information", label: "Information" },
  sponsored: { variant: "sponsored", label: "• Sponsored" },
  promo: { variant: "sponsored", label: "• Sponsored" },
};

/* ---------- Comments ---------- */

/** Top-level comments shown under a post before "See more comments". */
export const COMMENT_PREVIEW_LIMIT = 4;
/** Replies shown per thread before "View N more replies". */
export const VISIBLE_REPLIES = 2;
/** Lines of a comment shown before "See more". */
export const COMMENT_LINES = 3;
/** Matches the server's comment length limit. */
export const MAX_COMMENT_LENGTH = 2000;

/* ---------- Composer ---------- */

export const MAX_POST_LENGTH = 5000;
/** Matches `MAX_POST_IMAGES` on the server. */
export const MAX_POST_IMAGES = 10;

export const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
export const IMAGE_ACCEPT = [...IMAGE_MIME_TYPES].join(",");
export const DOCUMENT_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
].join(",");
