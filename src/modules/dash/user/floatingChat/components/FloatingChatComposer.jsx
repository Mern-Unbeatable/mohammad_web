import { useRef, useState } from "react";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import {
  acceptFiles,
  patchAttachment,
  readyAttachments,
  toPendingEntry,
} from "@/modules/messages/utils/attachments";
import { MAX_ATTACHMENTS } from "@/modules/messages/constant/constants";

const FILE_ACCEPT =
  "image/jpeg,image/png,image/gif,image/webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/mp4,video/quicktime";
const MAX_LENGTH = 5000;

/** Compact composer: text, attachments and send for the floating popup. */
const FloatingChatComposer = ({
  sending,
  requireText,
  uploadFile,
  onSend,
  onTyping,
  onStopTyping,
}) => {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState([]);
  const fileInputRef = useRef(null);

  const updateAttachment = (localId, patch) =>
    setPending((prev) => patchAttachment(prev, localId, patch));

  const handleFiles = (fileList) => {
    const accepted = acceptFiles(Array.from(fileList || []), pending.length, MAX_ATTACHMENTS);
    const entries = accepted.map(toPendingEntry);
    setPending((prev) => [...prev, ...entries]);
    accepted.forEach(async (file, index) => {
      const uploaded = await uploadFile(file);
      updateAttachment(entries[index].localId, uploaded ? { ...uploaded, uploading: false } : null);
    });
  };

  const onFileChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const ready = readyAttachments(pending);
  const uploading = pending.some((item) => item.uploading);
  const canSend =
    !sending &&
    !uploading &&
    (requireText ? draft.trim().length > 0 : draft.trim().length > 0 || ready.length > 0);

  const submit = async () => {
    if (!canSend) return;
    const ok = await onSend({ body: draft.trim(), attachments: ready });
    if (ok) {
      setDraft("");
      setPending([]);
      onStopTyping?.();
    }
  };

  const handleChange = (event) => {
    const value = event.target.value.slice(0, MAX_LENGTH);
    setDraft(value);
    if (value.trim()) onTyping?.();
    else onStopTyping?.();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="shrink-0 border-t border-[#E4E7EC] bg-white px-2.5 py-2">
      {pending.length ? (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {pending.map((item) => (
            <span
              key={item.localId}
              className="inline-flex max-w-[160px] items-center gap-1 rounded-full bg-[#F2F4F7] px-2 py-1 text-[11px] text-[#475467]"
            >
              {item.uploading ? <Loader2 className="h-3 w-3 shrink-0 animate-spin" /> : null}
              <span className="truncate">{item.name}</span>
              <button
                type="button"
                onClick={() => updateAttachment(item.localId, null)}
                aria-label={`Remove ${item.name}`}
                className="shrink-0 text-[#98A2B3] hover:text-[#D92D20]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-end gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={FILE_ACCEPT}
          onChange={onFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach a file"
          className="shrink-0 rounded-full p-2 text-[#64748B] transition-colors hover:bg-[#F2F4F7] hover:text-primary"
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>
        <textarea
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={onStopTyping}
          rows={1}
          placeholder="Write a message…"
          className="max-h-24 min-h-[38px] flex-1 resize-none rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[13px] text-deep-blue outline-none focus:border-primary focus:bg-white"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className="shrink-0 rounded-full bg-primary p-2 text-white transition-colors hover:bg-[#066BB0] disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <Send className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingChatComposer;
