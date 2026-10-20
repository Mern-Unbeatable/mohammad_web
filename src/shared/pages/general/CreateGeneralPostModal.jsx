import { useEffect, useRef, useState } from "react";
import { FileText, ImagePlus, Newspaper, Paperclip, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Avatar from "@/components/ui/Avatar";
import { generalApi } from "@/features/dash/user/general";
import { useAuth } from "@/shared/auth/useAuth";

const postTypes = [
  {
    id: "news",
    label: "News",
    sublabel: "Industry article",
    icon: Newspaper,
    activeBorder: "border-[#E67E22] bg-[#FEF3E8]/40",
    activeText: "text-[#E67E22]",
  },
  {
    id: "document",
    label: "Document",
    sublabel: "SOP, protocol, paper",
    icon: FileText,
    activeBorder: "border-[#E67E22] bg-[#FEF3E8]/40",
    activeText: "text-[#E67E22]",
  },
];

const fieldClass =
  "w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-deep-blue";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
const MAX_FILE_MB = 50;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const revokeIfBlob = (url) => {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
};

const UploadZone = ({
  label,
  hint,
  required = false,
  accept,
  previewUrl,
  previewIsImage = false,
  fileName,
  disabled = false,
  onPick,
  onClear,
}) => {
  const inputRef = useRef(null);

  return (
    <div>
      <p className={labelClass}>
        {label}
        {required ? <span className="text-pink-light"> *</span> : null}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onPick?.(file);
        }}
      />

      {previewUrl || fileName ? (
        <div className="relative overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]">
          {previewIsImage && previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="flex items-center gap-3 px-4 py-4">
              <Paperclip className="h-5 w-5 shrink-0 text-[#98A2B3]" />
              <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-deep-blue">
                {fileName || "Selected file"}
              </p>
            </div>
          )}
          <div className="flex gap-2 border-t border-[#E4E7EC] p-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="flex-1 rounded-md border border-[#E4E7EC] px-3 py-2 text-[12px] font-semibold text-[#475467] hover:bg-white disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onClear}
              className="inline-flex items-center justify-center rounded-md border border-[#E4E7EC] px-3 py-2 text-[#CC1016] hover:bg-white disabled:opacity-50"
              aria-label={`Remove ${label}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary/30 disabled:opacity-50"
        >
          {previewIsImage ? (
            <ImagePlus className="h-5 w-5 text-[#98A2B3]" />
          ) : (
            <Paperclip className="h-5 w-5 text-[#98A2B3]" />
          )}
          <span className="text-[13px] font-medium text-primary">
            Click to upload a file
          </span>
          <span className="text-[11px] text-[#98A2B3]">{hint}</span>
        </button>
      )}
    </div>
  );
};

const CreateGeneralPostModal = ({
  open,
  onClose,
  onSubmit,
  saving = false,
  initialValues = null,
  mode = "create",
}) => {
  const { user } = useAuth();
  const isEdit = mode === "edit";
  const [postType, setPostType] = useState("news");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [uploading, setUploading] = useState(false);

  const busy = saving || uploading;

  const authorName =
    user?.profile?.name ||
    [user?.profile?.firstName, user?.profile?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "Member";
  const authorCompany = user?.profile?.company || "";
  const authorInitials =
    user?.profile?.initials ||
    authorName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") ||
    "MB";
  const authorAvatar = user?.profile?.avatar || null;

  const resetMedia = () => {
    revokeIfBlob(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
    setDocumentFile(null);
    setDocumentName("");
  };

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPostType("news");
      setHeadline("");
      setSummary("");
      setSource("");
      setDocTitle("");
      setDescription("");
      setDocumentUrl("");
      resetMedia();
      setUploading(false);
      return;
    }

    if (initialValues) {
      setPostType(initialValues.postType || "news");
      setHeadline(initialValues.headline || "");
      setSummary(initialValues.summary || "");
      setSource(initialValues.source || "");
      setDocTitle(initialValues.docTitle || "");
      setDescription(initialValues.description || "");
      setDocumentUrl(initialValues.documentUrl || "");
      setImageFile(null);
      setDocumentFile(null);
      setDocumentName(
        initialValues.documentUrl
          ? initialValues.documentUrl.split("/").pop() || "Document"
          : "",
      );
      const existingImage = initialValues.imageUrl || "";
      // Avoid treating Unsplash placeholders as editable existing uploads
      const isRemoteUpload =
        Boolean(existingImage) &&
        !existingImage.includes("images.unsplash.com") &&
        /^https?:\/\//i.test(existingImage);
      setImageUrl(isRemoteUpload ? existingImage : "");
      setImagePreview(isRemoteUpload ? existingImage : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  useEffect(() => {
    return () => revokeIfBlob(imagePreview);
  }, [imagePreview]);

  if (!open) return null;

  const validateFile = (file, { imagesOnly = false } = {}) => {
    if (!file) return false;
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`File must be ${MAX_FILE_MB}MB or less`);
      return false;
    }
    if (imagesOnly && !IMAGE_MIME.has(file.type)) {
      toast.error("Use JPG, PNG, WebP, or GIF");
      return false;
    }
    return true;
  };

  const handlePickImage = (file) => {
    if (busy || !validateFile(file, { imagesOnly: true })) return;
    revokeIfBlob(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    if (busy) return;
    revokeIfBlob(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const handlePickDocument = (file) => {
    if (busy || !validateFile(file)) return;
    setDocumentFile(file);
    setDocumentName(file.name);
    setDocumentUrl("");
  };

  const handleClearDocument = () => {
    if (busy) return;
    setDocumentFile(null);
    setDocumentName("");
    setDocumentUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    if (
      postType === "document" &&
      !documentFile &&
      !String(documentUrl || "").trim()
    ) {
      toast.error("Upload a document or paste a document URL");
      return;
    }

    setUploading(true);
    try {
      let nextImageUrl = imageUrl || "";
      let nextDocumentUrl = documentUrl || "";

      if (imageFile) {
        const uploaded = await generalApi.uploadFile(imageFile);
        nextImageUrl = uploaded.url;
      }

      if (documentFile) {
        const uploaded = await generalApi.uploadFile(documentFile);
        nextDocumentUrl = uploaded.url;
      }

      if (typeof onSubmit === "function") {
        const ok = await onSubmit({
          postType,
          headline,
          summary,
          source,
          docTitle,
          description,
          documentUrl: nextDocumentUrl,
          imageUrl: nextImageUrl,
        });
        if (ok !== false) onClose();
        return;
      }

      onClose();
    } catch (err) {
      toast.error(
        generalApi.getApiErrorMessage(err, "Failed to upload file"),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleBackdropClose = () => {
    if (busy) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center overflow-hidden bg-black/50 sm:items-center sm:p-4"
      onClick={handleBackdropClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-2xl bg-white sm:max-h-[90vh] sm:rounded-xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={authorAvatar}
              alt={authorName}
              initials={authorInitials}
              size="md"
            />
            <div>
              <p className="text-[14px] font-semibold text-deep-blue">
                {authorName}
              </p>
              <p className="text-[12px] text-[#64748B]">{authorCompany}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleBackdropClose}
            disabled={busy}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
              Post type
            </p>
            <div className="mb-5 grid grid-cols-2 gap-3">
              {postTypes.map(
                ({
                  id,
                  label,
                  sublabel,
                  icon: Icon,
                  activeBorder,
                  activeText,
                }) => {
                  const active = postType === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={busy || isEdit}
                      onClick={() => setPostType(id)}
                      className={`rounded-xl border-2 px-3 py-3 text-left transition-colors disabled:opacity-60 ${
                        active
                          ? activeBorder
                          : "border-[#E4E7EC] hover:border-[#D0D5DD]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? activeText : "text-[#64748B]"}`}
                      />
                      <p
                        className={`mt-2 text-[13px] font-semibold ${active ? activeText : "text-deep-blue"}`}
                      >
                        {label}
                      </p>
                      <p className="text-[11px] text-[#98A2B3]">{sublabel}</p>
                    </button>
                  );
                },
              )}
            </div>

            {postType === "news" ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="headline" className={labelClass}>
                    Headline<span className="text-pink-light"> *</span>
                  </label>
                  <input
                    id="headline"
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. FDA Issues New Draft Guidance on Analytical Procedures"
                    className={fieldClass}
                    required
                    disabled={busy}
                  />
                </div>
                <div>
                  <label htmlFor="summary" className={labelClass}>
                    Summary / Description
                    <span className="text-pink-light"> *</span>
                  </label>
                  <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={3}
                    placeholder="Write a brief summary of the news article..."
                    className={`${fieldClass} resize-y`}
                    required
                    disabled={busy}
                  />
                </div>
                <div>
                  <label htmlFor="source" className={labelClass}>
                    Source / Publisher{" "}
                    <span className="font-normal text-[#98A2B3]">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="source"
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. EMA, FDA, Nature, LabManager"
                    className={fieldClass}
                    disabled={busy}
                  />
                </div>
                <UploadZone
                  label="Upload Image"
                  hint="JPEG, PNG, WebP, GIF — up to 50 MB"
                  accept={IMAGE_ACCEPT}
                  previewUrl={imagePreview}
                  previewIsImage
                  disabled={busy}
                  onPick={handlePickImage}
                  onClear={handleClearImage}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="docTitle" className={labelClass}>
                    Document Title<span className="text-pink-light"> *</span>
                  </label>
                  <input
                    id="docTitle"
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. HPLC Method Validation SOP v2.1"
                    className={fieldClass}
                    required
                    disabled={busy}
                  />
                </div>
                <div>
                  <label htmlFor="description" className={labelClass}>
                    Description{" "}
                    <span className="font-normal text-[#98A2B3]">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe what this document covers..."
                    className={`${fieldClass} resize-y`}
                    disabled={busy}
                  />
                </div>
                <UploadZone
                  label="Upload Document"
                  hint="PDF, DOC, XLS, PPT — up to 50 MB"
                  required
                  accept={DOCUMENT_ACCEPT}
                  previewUrl={documentUrl || (documentFile ? "file" : "")}
                  fileName={documentName || documentUrl}
                  disabled={busy}
                  onPick={handlePickDocument}
                  onClear={handleClearDocument}
                />
                {!documentFile && !documentUrl ? (
                  <div>
                    <label htmlFor="documentUrl" className={labelClass}>
                      Or paste Document URL
                      <span className="text-pink-light"> *</span>
                    </label>
                    <input
                      id="documentUrl"
                      type="url"
                      value={documentUrl}
                      onChange={(e) => {
                        setDocumentUrl(e.target.value);
                        setDocumentName("");
                        setDocumentFile(null);
                      }}
                      placeholder="https://example.com/document.pdf"
                      className={fieldClass}
                      required={!documentFile}
                      disabled={busy}
                    />
                  </div>
                ) : null}
                <UploadZone
                  label="Upload Image"
                  hint="JPEG, PNG, WebP, GIF — up to 50 MB"
                  accept={IMAGE_ACCEPT}
                  previewUrl={imagePreview}
                  previewIsImage
                  disabled={busy}
                  onPick={handlePickImage}
                  onClear={handleClearImage}
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t border-[#E4E7EC] bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={handleBackdropClose}
              disabled={busy}
              className="rounded-md border border-[#E4E7EC] px-4 py-2 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
            >
              {uploading
                ? "Uploading…"
                : saving
                  ? isEdit
                    ? "Saving…"
                    : "Publishing…"
                  : isEdit
                    ? "Save changes"
                    : postType === "news"
                      ? "Publish News"
                      : "Share Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGeneralPostModal;
