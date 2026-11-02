import { BLOG_CATEGORY_OPTIONS } from "@/features/dash/admin/blogs";
import {
  DEFAULT_READ_TIME,
  IMAGE_MIME,
  MAX_FILE_BYTES,
  MAX_FILE_MB,
} from "../constant/constants";

export const revokeIfBlob = (url) => {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
};

/** Validation message for a picked cover image, or null when it is usable. */
export const imageFileError = (file) => {
  if (file.size > MAX_FILE_BYTES) return `Image must be ${MAX_FILE_MB}MB or less`;
  if (!IMAGE_MIME.has(file.type)) return "Use JPG, PNG, WebP, or GIF";
  return null;
};

/** Text fields for a new post, or prefilled from the card model being edited. */
export const initialBlogFields = (editing) => ({
  title: editing?.title ?? "",
  category: editing?.category ?? BLOG_CATEGORY_OPTIONS[0],
  excerpt: editing?.excerpt ?? "",
  body: editing?.body ?? editing?.excerpt ?? "",
  readTime: editing?.readTime ?? DEFAULT_READ_TIME,
  publish: editing ? Boolean(editing?.publishedAt) : true,
});

/** Create / update payload; the body falls back to the excerpt, the image is added by the caller. */
export const buildBlogPayload = (fields) => ({
  title: fields.title.trim(),
  category: fields.category.trim(),
  excerpt: fields.excerpt.trim(),
  body: fields.body.trim() || fields.excerpt.trim(),
  readTime: fields.readTime.trim() || undefined,
  publish: fields.publish,
});

export const submitLabel = ({ uploading, saving, isEdit, publish }) => {
  if (uploading) return "Uploading…";
  if (saving) return "Saving…";
  if (isEdit) return "Update";
  return publish ? "Publish" : "Save draft";
};
