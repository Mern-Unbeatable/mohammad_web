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
