import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { feedApi, getApiErrorMessage } from "@/features/user/feed";
import { IMAGE_MIME_TYPES, MAX_POST_IMAGES } from "../constants";
import { formatBytes } from "../utils/formatBytes";
import { getPostTypeOption } from "../utils/postTypeOptions";

const toExistingImage = (url) => ({ id: url, url });

const toNewImage = (file, index) => ({
  id: `new-${Date.now()}-${index}-${file.name}`,
  file,
  preview: URL.createObjectURL(file),
});

const revokePreviews = (images) =>
  images.forEach((image) => image.preview && URL.revokeObjectURL(image.preview));

const sameList = (a, b) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/** Starting values; in edit mode they come from the post being edited. */
const getInitialDraft = (post) => ({
  content: post?.content || "",
  imageUrls: post?.images || [],
  document: post?.attachment?.url
    ? { name: post.attachment.name, url: post.attachment.url }
    : null,
});

/** Uploads newly picked images, keeping the user's order with existing URLs. */
const uploadImages = async (images) => {
  const fresh = images.filter((image) => image.file);
  const uploaded = await feedApi.uploadFiles(fresh.map((image) => image.file));
  const urlById = new Map(fresh.map((image, index) => [image.id, uploaded[index].url]));
  return images.map((image) => image.url || urlById.get(image.id));
};

const uploadDocument = async (file) => {
  const uploaded = await feedApi.uploadFile(file);
  return {
    documentUrl: uploaded.url,
    documentMeta: {
      name: uploaded.originalName || file.name,
      meta: formatBytes(uploaded.size || file.size),
    },
  };
};

/**
 * Draft state for the create/edit post dialog: text, post type, images and
 * one document. Uploads attachments on publish, then calls `onPublish`.
 * Mount it only while the dialog is open so each opening starts fresh.
 */
export function usePostDraft({ post, isEdit, isRepostEdit, initialOption, submitting, onPublish }) {
  const initial = useMemo(() => getInitialDraft(isEdit ? post : null), [isEdit, post]);

  const [postOption, setPostOption] = useState(initialOption);
  const [content, setContent] = useState(initial.content);
  /** Ordered: existing images have `url`, newly picked ones have `file` and `preview`. */
  const [images, setImages] = useState(() => initial.imageUrls.map(toExistingImage));
  const [documentFile, setDocumentFile] = useState(null);
  const [existingDocument, setExistingDocument] = useState(initial.document);
  const [uploading, setUploading] = useState(false);

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => revokePreviews(imagesRef.current), []);

  const busy = submitting || uploading;
  const hasImage = images.length > 0;
  const hasNewImages = images.some((image) => image.file);
  const hasDocument = Boolean(documentFile || existingDocument);
  // A repost's caption may be empty because the shared post is its content.
  const hasBody = isRepostEdit || Boolean(content.trim() || hasImage || hasDocument);
  const hasChanges =
    !isEdit ||
    content.trim() !== initial.content.trim() ||
    hasNewImages ||
    Boolean(documentFile) ||
    !sameList(images.map((image) => image.url), initial.imageUrls) ||
    existingDocument?.url !== initial.document?.url;

  let shownDocument = null;
  if (documentFile) {
    shownDocument = { name: documentFile.name, meta: formatBytes(documentFile.size) };
  } else if (existingDocument) {
    shownDocument = { name: existingDocument.name, meta: "Current document" };
  }

  let submitLabel = "Publish";
  if (uploading && (!isEdit || hasNewImages || documentFile)) submitLabel = "Uploading…";
  else if (isEdit) submitLabel = busy ? "Saving…" : "Save";

  const addImages = (files) => {
    const valid = files.filter((file) => IMAGE_MIME_TYPES.has(file.type));
    if (valid.length < files.length) {
      toast.error("Only JPEG, PNG, WebP, or GIF images can be added");
    }
    const room = MAX_POST_IMAGES - images.length;
    if (valid.length > room) {
      toast.error(`A post can have up to ${MAX_POST_IMAGES} images`);
    }
    const added = valid.slice(0, Math.max(room, 0)).map(toNewImage);
    if (added.length) setImages((prev) => [...prev, ...added]);
  };

  const removeImage = (id) =>
    setImages((prev) => {
      revokePreviews(prev.filter((image) => image.id === id));
      return prev.filter((image) => image.id !== id);
    });

  const setDocument = (file) => {
    if (IMAGE_MIME_TYPES.has(file.type)) {
      toast.error("Use the Image button for photos");
      return;
    }
    setDocumentFile(file);
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setExistingDocument(null);
  };

  const canPublish = hasBody && hasChanges && !busy;

  const publish = async () => {
    if (!canPublish || !onPublish) return;
    setUploading(true);
    try {
      const imageUrls = await uploadImages(images);
      const documentFields = documentFile
        ? await uploadDocument(documentFile)
        : { documentUrl: isEdit ? existingDocument?.url || null : undefined };

      await onPublish({
        type: getPostTypeOption(postOption).type,
        content: content.trim(),
        imageUrls,
        ...documentFields,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upload file"));
    } finally {
      setUploading(false);
    }
  };

  return {
    postOption,
    setPostOption,
    content,
    setContent,
    images,
    addImages,
    removeImage,
    shownDocument,
    setDocument,
    removeDocument,
    busy,
    hasImage,
    hasDocument,
    canAddImages: images.length < MAX_POST_IMAGES,
    canPublish,
    submitLabel,
    publish,
  };
}
