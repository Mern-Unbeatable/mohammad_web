/** Shared CV/résumé upload rules (mirrors the server validation). */

export const CV_MAX_BYTES = 10 * 1024 * 1024;

export const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];

const extensionOf = (name = "") => {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
};

/** Returns an error message when the file is not an acceptable CV, else null. */
export function validateCvFile(file) {
  if (!file) return "Please attach your CV/résumé";
  if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
    return "Your CV must be a PDF, DOC or DOCX file";
  }
  if (file.size > CV_MAX_BYTES) {
    return "Your CV must be 10 MB or smaller";
  }
  return null;
}

/** Human-readable file size, e.g. "842 KB" or "1.3 MB". */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
