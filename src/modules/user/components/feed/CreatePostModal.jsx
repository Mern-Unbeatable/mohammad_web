import { useEffect, useMemo, useRef, useState } from "react";
import { X, Image, FileText, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Avatar from "@/components/ui/Avatar";
import { feedApi, getApiErrorMessage } from "@/features/user/feed";
import {
  DEFAULT_POST_OPTION,
  POST_TYPE_OPTIONS,
  getPostTypeOption,
} from "./postTypeOptions";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Matches `MAX_POST_IMAGES` on the server. */
const MAX_POST_IMAGES = 10;

const toExistingImage = (url) => ({ id: url, url });

const revokePreviews = (images) =>
  images.forEach(
    (image) => image.preview && URL.revokeObjectURL(image.preview),
  );

const sameList = (a, b) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Starting values; in edit mode they come from the post being edited. */
const getInitialDraft = (post) => ({
  content: post?.content || "",
  imageUrls: post?.images || [],
  document: post?.attachment?.url
    ? { name: post.attachment.name, url: post.attachment.url }
    : null,
});

const CreatePostModal = ({
  open,
  onClose,
  user,
  onPublish,
  submitting = false,
  initialOption = DEFAULT_POST_OPTION,
  mode = "create",
  post = null,
}) => {
  const isEdit = mode === "edit" && Boolean(post);
  const isRepostEdit = isEdit && Boolean(post.isRepost);
  const initial = useMemo(
    () => getInitialDraft(isEdit ? post : null),
    [isEdit, post],
  );

  const [postOption, setPostOption] = useState(initialOption);
  const [content, setContent] = useState(initial.content);
  /** Ordered: existing images have `url`, newly picked ones have `file` and `preview`. */
  const [images, setImages] = useState(() =>
    initial.imageUrls.map(toExistingImage),
  );
  const [documentFile, setDocumentFile] = useState(null);
  const [existingDocument, setExistingDocument] = useState(initial.document);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => () => revokePreviews(imagesRef.current), []);

  useEffect(() => {
    if (!open) {
      revokePreviews(imagesRef.current);
      setContent(initial.content);
      setPostOption(initialOption);
      setImages(initial.imageUrls.map(toExistingImage));
      setDocumentFile(null);
      setExistingDocument(initial.document);
      setUploading(false);
      return undefined;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialOption, initial]);

  if (!open) return null;

  const displayName = user?.name || "You";
  const company = user?.company || "";
  const busy = submitting || uploading;
  const hasNewImages = images.some((image) => image.file);
  const hasImage = images.length > 0;
  const canAddImages = images.length < MAX_POST_IMAGES;
  const hasDocument = Boolean(documentFile || existingDocument);
  // A repost's caption may be empty because the shared post is its content.
  const hasBody =
    isRepostEdit || Boolean(content.trim() || hasImage || hasDocument);
  const hasChanges =
    !isEdit ||
    content.trim() !== initial.content.trim() ||
    hasNewImages ||
    Boolean(documentFile) ||
    !sameList(
      images.map((image) => image.url),
      initial.imageUrls,
    ) ||
    existingDocument?.url !== initial.document?.url;
  const canPublish = hasBody && hasChanges && !busy;
  const shownDocument = documentFile
    ? { name: documentFile.name, meta: formatBytes(documentFile.size) }
    : existingDocument
      ? { name: existingDocument.name, meta: "Current document" }
      : null;
  const submitLabel = isEdit
    ? uploading && (hasNewImages || documentFile)
      ? "Uploading…"
      : busy
        ? "Saving…"
        : "Save"
    : uploading
      ? "Uploading…"
      : "Publish";

  const removeImage = (id) => {
    setImages((prev) => {
      revokePreviews(prev.filter((image) => image.id === id));
      return prev.filter((image) => image.id !== id);
    });
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setExistingDocument(null);
  };

  const handleImagePick = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;

    const valid = picked.filter((file) => IMAGE_MIME.has(file.type));
    if (valid.length < picked.length) {
      toast.error("Only JPEG, PNG, WebP, or GIF images can be added");
    }
    const room = MAX_POST_IMAGES - images.length;
    if (valid.length > room) {
      toast.error(`A post can have up to ${MAX_POST_IMAGES} images`);
    }
    const added = valid.slice(0, Math.max(room, 0)).map((file, index) => ({
      id: `new-${Date.now()}-${index}-${file.name}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    if (added.length) setImages((prev) => [...prev, ...added]);
  };

  const handleDocumentPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (IMAGE_MIME.has(file.type)) {
      toast.error("Use the Image button for photos");
      return;
    }
    setDocumentFile(file);
  };

  const handlePublish = async () => {
    if (!canPublish || !onPublish) return;

    let documentUrl = isEdit ? existingDocument?.url || null : undefined;
    let documentMeta;

    try {
      setUploading(true);

      const newImages = images.filter((image) => image.file);
      const uploadedImages = await feedApi.uploadFiles(
        newImages.map((image) => image.file),
      );
      const uploadedUrls = new Map(
        newImages.map((image, index) => [image.id, uploadedImages[index].url]),
      );
      const imageUrls = images.map(
        (image) => image.url || uploadedUrls.get(image.id),
      );

      if (documentFile) {
        const uploaded = await feedApi.uploadFile(documentFile);
        documentUrl = uploaded.url;
        documentMeta = {
          name: uploaded.originalName || documentFile.name,
          meta: formatBytes(uploaded.size || documentFile.size),
        };
      }

      await onPublish({
        type: getPostTypeOption(postOption).type,
        content: content.trim(),
        imageUrls,
        documentUrl,
        documentMeta,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upload file"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 sm:items-center sm:p-4"
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[#E4E7EC] bg-white px-4 py-3 sm:px-5">
          <h2 id="create-post-title" className="sr-only">
            {isEdit ? "Edit Post" : "Create Post"}
          </h2>
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              src={user?.avatar}
              alt={displayName}
              initials={user?.initials || "U"}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-deep-blue">
                {displayName}
              </p>
              {company ? (
                <p className="truncate text-[12px] text-[#64748B]">{company}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="shrink-0 rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {isEdit ? null : (
            <div className="mb-4 flex flex-wrap gap-2">
              {POST_TYPE_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPostOption(id)}
                  disabled={busy}
                  aria-pressed={postOption === id}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors sm:px-3.5 sm:text-[12px] ${
                    postOption === id
                      ? "border-primary bg-secondary text-primary"
                      : "border-[#E4E7EC] text-[#475467] hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={5000}
            disabled={busy}
            aria-label={isRepostEdit ? "Caption" : "Post content"}
            placeholder={
              isRepostEdit
                ? "Add a caption (optional)"
                : "Write something useful for the laboratory community..."
            }
            className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 sm:px-4 sm:py-3"
          />

          {hasImage ? (
            <div className="mt-3">
              <div
                className={`grid gap-2 ${
                  images.length === 1 ? "grid-cols-1" : "grid-cols-5"
                }`}
              >
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] ${
                      images.length === 1 ? "min-h-[56px]" : "aspect-square"
                    }`}
                  >
                    <img
                      src={image.preview || image.url}
                      alt=""
                      className={
                        images.length === 1
                          ? "max-h-56 w-full object-cover"
                          : "h-full w-full object-cover"
                      }
                    />
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => removeImage(image.id)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[12px] text-[#64748B]">
                {images.length} / {MAX_POST_IMAGES} images
              </p>
            </div>
          ) : null}

          {shownDocument ? (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-deep-blue">
                  {shownDocument.name}
                </p>
                <p className="text-[12px] text-[#64748B]">
                  {shownDocument.meta}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={removeDocument}
                className="rounded-md p-1.5 text-[#64748B] hover:bg-white"
                aria-label="Remove document"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-3 border-t border-[#E4E7EC] bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 sm:pb-4">
          <div className="flex gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              className="hidden"
              onChange={handleImagePick}
            />
            <input
              ref={documentInputRef}
              type="file"
              accept={DOCUMENT_ACCEPT}
              className="hidden"
              onChange={handleDocumentPick}
            />
            <button
              type="button"
              disabled={busy || !canAddImages}
              title={
                canAddImages ? undefined : `Up to ${MAX_POST_IMAGES} images`
              }
              onClick={() => imageInputRef.current?.click()}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-[13px] font-medium hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${
                hasImage
                  ? "border-primary bg-secondary text-primary"
                  : "border-[#E4E7EC] text-[#475467]"
              }`}
            >
              <Image className="h-4 w-4" />
              Image
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => documentInputRef.current?.click()}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-[13px] font-medium hover:bg-[#F9FAFB] sm:flex-none ${
                hasDocument
                  ? "border-primary bg-secondary text-primary"
                  : "border-[#E4E7EC] text-[#475467]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Document
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center rounded-md border border-[#E4E7EC] py-2.5 text-[14px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-5"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canPublish}
              onClick={handlePublish}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-6"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
