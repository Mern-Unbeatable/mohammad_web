/** Map API general posts onto GeneralPostCard / detail UI props. */
import { formatDate } from "@/shared/utils/date";

export const GENERAL_CATEGORY_OPTIONS = ["All", "News", "Document"];

const TYPE_LABEL = {
  NEWS: "news",
  DOCUMENT: "document",
  news: "news",
  document: "document",
};

const CATEGORY_TO_API = {
  All: undefined,
  News: "news",
  Document: "document",
};

export const categoryToApi = (label) => CATEGORY_TO_API[label];

export function formatPostDate(dateValue) {
  return formatDate(dateValue, { format: "long" });
}

export function formatDisplayDate(dateValue) {
  return formatDate(dateValue, { format: "monthYear" });
}

export function toGeneralPostModel(post) {
  if (!post) return null;

  const type = TYPE_LABEL[post.type] || String(post.type || "").toLowerCase();

  return {
    ...post,
    type,
    image: post.imageUrl || post.image || "",
    date: formatPostDate(post.date),
    displayDate: formatDisplayDate(post.date),
    category: post.category || "General",
    summary: post.summary || "",
    body: Array.isArray(post.body) ? post.body : [],
    documentUrl: post.documentUrl || null,
  };
}
