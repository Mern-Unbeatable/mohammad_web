/** Map API general posts onto GeneralPostCard / detail UI props. */

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

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop";

export const categoryToApi = (label) => CATEGORY_TO_API[label];

export function formatPostDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDisplayDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function toGeneralPostModel(post) {
  if (!post) return null;

  const type = TYPE_LABEL[post.type] || String(post.type || "").toLowerCase();
  const body = Array.isArray(post.body)
    ? post.body
    : post.summary
      ? [post.summary]
      : [];

  return {
    ...post,
    type,
    image: post.imageUrl || post.image || PLACEHOLDER_IMAGE,
    date: formatPostDate(post.date || post.createdAt),
    displayDate: formatDisplayDate(post.date || post.createdAt),
    category: post.category || post.source || "General",
    summary: post.summary || "",
    body,
    documentUrl: post.documentUrl || null,
  };
}

/**
 * Build create payload from CreateGeneralPostModal form values.
 */
export function formToCreatePayload(form) {
  const isDocument = form.postType === "document";
  const title = String(isDocument ? form.docTitle : form.headline).trim();
  const summary = String(
    isDocument ? form.description : form.summary,
  ).trim();

  const payload = {
    type: isDocument ? "DOCUMENT" : "NEWS",
    title,
    body: summary
      ? summary
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [],
  };

  if (summary) payload.summary = summary;
  if (form.source?.trim()) payload.source = form.source.trim();
  if (form.category?.trim()) payload.category = form.category.trim();
  if (form.imageUrl) payload.imageUrl = form.imageUrl;
  if (isDocument && form.documentUrl?.trim()) {
    payload.documentUrl = form.documentUrl.trim();
  }

  return payload;
}

/** Map API/general post model onto CreateGeneralPostModal fields. */
export function postToFormValues(post) {
  if (!post) {
    return {
      postType: "news",
      headline: "",
      summary: "",
      source: "",
      docTitle: "",
      description: "",
      documentUrl: "",
      imageUrl: "",
    };
  }

  const type = TYPE_LABEL[post.type] || String(post.type || "").toLowerCase();
  const isDocument = type === "document";
  const bodyText = Array.isArray(post.body)
    ? post.body.join("\n")
    : post.summary || "";

  return {
    postType: isDocument ? "document" : "news",
    headline: isDocument ? "" : post.title || "",
    summary: isDocument ? "" : bodyText || post.summary || "",
    source: post.source || post.category || "",
    docTitle: isDocument ? post.title || "" : "",
    description: isDocument ? bodyText || post.summary || "" : "",
    documentUrl: post.documentUrl || "",
    imageUrl:
      post.imageUrl && !String(post.imageUrl).includes("images.unsplash.com")
        ? post.imageUrl
        : "",
  };
}
