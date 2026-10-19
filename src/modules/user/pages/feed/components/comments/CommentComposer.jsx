import { useRef, useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { MAX_COMMENT_LENGTH } from "../../constants";

/** Tallest the box grows before it scrolls. */
const MAX_INPUT_HEIGHT = 160;
/** Show the character counter once this close to the limit. */
const COUNTER_THRESHOLD = MAX_COMMENT_LENGTH - 200;

const fitHeight = (el) => {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
};

/**
 * Top-level "Add a comment" box: grows with its text, Enter posts and
 * Shift+Enter adds a line. `onSubmit` resolves `false` to keep the draft.
 */
const CommentComposer = ({ currentUser, onSubmit }) => {
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const canSubmit = Boolean(draft.trim()) && !submitting;

  const handleChange = (event) => {
    setDraft(event.target.value);
    fitHeight(event.target);
  };

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const ok = await onSubmit(text);
      if (ok !== false) {
        setDraft("");
        if (inputRef.current) inputRef.current.style.height = "";
      }
    } finally {
      setSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    handleSubmit();
  };

  return (
    <div className="mb-6 flex items-start gap-2.5 sm:gap-3">
      <Avatar
        src={currentUser?.avatar}
        alt={currentUser?.name || "Member"}
        initials={currentUser?.initials || "MB"}
        size="md"
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-1 rounded-3xl border border-[#E4E7EC] bg-[#F9FAFB] py-1 pl-4 pr-1 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="Add a professional comment..."
            aria-label="Write a comment"
            disabled={submitting}
            className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[16px] leading-5 text-deep-blue outline-none placeholder:text-[13px] placeholder:text-[#98A2B3] disabled:opacity-60 sm:text-[14px]"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-label={submitting ? "Posting comment" : "Post comment"}
            title="Post comment"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
              canSubmit || submitting
                ? "bg-primary text-white hover:opacity-90"
                : "text-[#98A2B3]"
            } disabled:cursor-not-allowed`}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </button>
        </div>
        {draft ? (
          <div className="mt-1 flex justify-between gap-2 px-4 text-[11px] text-[#98A2B3]">
            <span className="hidden sm:inline">Enter to post · Shift+Enter for a new line</span>
            {draft.length >= COUNTER_THRESHOLD ? (
              <span className="ml-auto tabular-nums">
                {draft.length}/{MAX_COMMENT_LENGTH}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommentComposer;
