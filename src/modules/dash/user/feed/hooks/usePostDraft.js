import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { feedApi, getApiErrorMessage } from "@/features/dash/user/feed";
import { IMAGE_MIME_TYPES, MAX_POST_IMAGES } from "../constants";
import { formatBytes } from "../utils/formatBytes";
import {
  getInitialDraft,
  getShownDocument,
  getSubmitLabel,
  hasDraftChanges,
  mergeUploadedImageUrls,
  pickImageFiles,
} from "../utils/postDraft";
import { getPostTypeOption } from "../utils/postTypeOptions";

const toExistingImage = (url) => ({ id: url, url });

const toNewImage = (file, index) => ({
  id: `new-${Date.now()}-${index}-${file.name}`,
  file,
  preview: URL.createObjectURL(file),
});

const revokePreviews = (images) =>
  images.forEach((image) => image.preview && URL.revokeObjectURL(image.preview));

const uploadImages = async (images) => {
  const files = images.filter((image) => image.file).map((image) => image.file);
  return mergeUploadedImageUrls(images, await feedApi.uploadFiles(files));
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
  const hasDocument = Boolean(documentFile || existingDocument);
  // A repost's caption may be empty because the shared post is its content.
  const hasBody = isRepostEdit || Boolean(content.trim() || hasImage || hasDocument);
  const hasChanges =
    !isEdit || hasDraftChanges({ initial, content, images, documentFile, existingDocument });
  const canPublish = hasBody && hasChanges && !busy;

  const addImages = (files) => {
    const { accepted, invalidType, overLimit } = pickImageFiles(files, images.length);
    if (invalidType) toast.error("Only JPEG, PNG, WebP, or GIF images can be added");
    if (overLimit) toast.error(`A post can have up to ${MAX_POST_IMAGES} images`);
    if (accepted.length) setImages((prev) => [...prev, ...accepted.map(toNewImage)]);
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
    shownDocument: getShownDocument(documentFile, existingDocument),
    setDocument,
    removeDocument,
    busy,
    hasImage,
    hasDocument,
    canAddImages: images.length < MAX_POST_IMAGES,
    canPublish,
    submitLabel: getSubmitLabel({
      isEdit,
      uploading,
      busy,
      hasUploads: images.some((image) => image.file) || Boolean(documentFile),
    }),
    publish,
  };
}
