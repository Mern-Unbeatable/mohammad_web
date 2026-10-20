import { IMAGE_MIME_TYPES, MAX_POST_IMAGES } from "../constants";
import { formatBytes } from "./formatBytes";

/*
 * Draft images are ordered: existing ones have `url`, newly picked ones have
 * `file` (and a `preview` object URL until they are uploaded).
 */

const sameList = (a, b) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/** Starting values; in edit mode they come from the post being edited. */
export const getInitialDraft = (post) => ({
  content: post?.content || "",
  imageUrls: post?.images || [],
  document: post?.attachment?.url
    ? { name: post.attachment.name, url: post.attachment.url }
    : null,
});

/** Which picked files can be added: supported image types, up to the per-post limit. */
export const pickImageFiles = (files, currentCount) => {
  const valid = files.filter((file) => IMAGE_MIME_TYPES.has(file.type));
  const room = Math.max(MAX_POST_IMAGES - currentCount, 0);
  return {
    accepted: valid.slice(0, room),
    invalidType: valid.length < files.length,
    overLimit: valid.length > room,
  };
};

/** In edit mode, whether anything differs from the post being edited. */
export const hasDraftChanges = ({ initial, content, images, documentFile, existingDocument }) =>
  content.trim() !== initial.content.trim() ||
  images.some((image) => image.file) ||
  Boolean(documentFile) ||
  !sameList(images.map((image) => image.url), initial.imageUrls) ||
  existingDocument?.url !== initial.document?.url;

/** Name and size line for the attached document, newly picked or existing. */
export const getShownDocument = (documentFile, existingDocument) => {
  if (documentFile) return { name: documentFile.name, meta: formatBytes(documentFile.size) };
  if (existingDocument) return { name: existingDocument.name, meta: "Current document" };
  return null;
};

/** `hasUploads`: the draft has newly picked images or a new document. */
export const getSubmitLabel = ({ isEdit, uploading, busy, hasUploads }) => {
  if (uploading && (!isEdit || hasUploads)) return "Uploading…";
  if (isEdit) return busy ? "Saving…" : "Save";
  return "Publish";
};

/** Final image URLs in draft order, using `uploaded` rows for the newly picked images. */
export const mergeUploadedImageUrls = (images, uploaded) => {
  const fresh = images.filter((image) => image.file);
  const urlById = new Map(fresh.map((image, index) => [image.id, uploaded[index]?.url]));
  return images.map((image) => image.url || urlById.get(image.id));
};
