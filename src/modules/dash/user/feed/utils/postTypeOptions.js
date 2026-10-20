export const POST_TYPE_OPTIONS = [
  { id: "post", label: "Create Post", type: "information" },
  { id: "question", label: "Ask a Question", type: "question" },
  { id: "share", label: "Share Information", type: "information" },
];

export const DEFAULT_POST_OPTION = "post";

export const getPostTypeOption = (id) =>
  POST_TYPE_OPTIONS.find((option) => option.id === id) ||
  POST_TYPE_OPTIONS.find((option) => option.id === DEFAULT_POST_OPTION);
