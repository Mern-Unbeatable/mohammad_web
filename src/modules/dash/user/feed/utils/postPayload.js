const API_POST_TYPES = {
  question: "QUESTION",
  suppliers: "SUPPLIERS",
};

/** Composer values → `createPost` body. Unknown types publish as INFORMATION. */
export const toCreatePostPayload = ({ type, content, imageUrls, documentUrl }) => ({
  type: API_POST_TYPES[type] || "INFORMATION",
  content: (content || "").trim(),
  ...(imageUrls?.length ? { imageUrls } : {}),
  ...(documentUrl ? { documentUrl } : {}),
});
