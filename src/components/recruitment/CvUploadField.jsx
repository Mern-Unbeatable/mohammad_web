import { useEffect, useMemo, useRef } from "react";
import { Eye, FileText, Trash2, Upload } from "lucide-react";
import { CV_ACCEPT, formatFileSize } from "@/features/recruitment/cvFile";

/**
 * CV/résumé picker for the apply form. Shows the chosen file with preview,
 * replace and remove actions before the application is submitted. The parent
 * owns the selected `File`; this component only reports selection/removal.
 */
const CvUploadField = ({ file, onSelect, onRemove, error, disabled }) => {
  const inputRef = useRef(null);

  // Local object URL so the applicant can preview the file before submitting;
  // the previous URL is released whenever the file changes or on unmount.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const openPicker = () => inputRef.current?.click();

  const handleChange = (event) => {
    const selected = event.target.files?.[0] || null;
    // Reset so selecting the same file again still fires change.
    event.target.value = "";
    if (selected) onSelect(selected);
  };

  const describedBy = error ? "cv-upload-error" : undefined;

  return (
    <div>
      <label className="block text-[13px] font-semibold text-deep-blue">
        CV / Résumé <span className="text-[#CC1016]">*</span>
      </label>
      <p className="mt-0.5 text-[12px] text-[#64748B]">PDF, DOC or DOCX · up to 10 MB</p>

      <input
        ref={inputRef}
        type="file"
        accept={CV_ACCEPT}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {file ? (
        <div
          className={`mt-2 flex items-center gap-3 rounded-lg border bg-white p-3 ${
            error ? "border-[#FDA29B]" : "border-[#E4E7EC]"
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F3FB] text-primary">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-deep-blue" title={file.name}>
              {file.name}
            </p>
            <p className="text-[12px] text-[#98A2B3]">{formatFileSize(file.size)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preview CV"
                title="Preview"
                className="rounded-md p-2 text-[#64748B] transition-colors hover:bg-[#F9FAFB] hover:text-primary"
              >
                <Eye className="h-4 w-4" />
              </a>
            ) : null}
            <button
              type="button"
              onClick={openPicker}
              disabled={disabled}
              className="rounded-md px-2.5 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB] disabled:opacity-60"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              aria-label="Remove CV"
              title="Remove"
              className="rounded-md p-2 text-[#64748B] transition-colors hover:bg-[#FEF3F2] hover:text-[#D92D20] disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          aria-describedby={describedBy}
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-5 text-[13px] font-semibold transition-colors disabled:opacity-60 ${
            error
              ? "border-[#FDA29B] text-[#D92D20] hover:bg-[#FEF3F2]"
              : "border-[#CBD5E1] text-[#475467] hover:border-primary hover:bg-[#E8F3FB] hover:text-primary"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload your CV
        </button>
      )}

      {error ? (
        <p id="cv-upload-error" className="mt-1.5 text-[12px] font-medium text-[#D92D20]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default CvUploadField;
