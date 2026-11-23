import { useState } from "react";
import { Send } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useFocusAtEnd } from "../../hooks/useFocusAtEnd";

/** Reply box under a comment; mounted fresh for each reply target. */
const InlineReplyBox = ({ currentUser, initialValue = "", submitting, onSubmit, onCancel }) => {
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useFocusAtEnd();

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    const ok = await onSubmit(text);
    if (ok !== false) setDraft("");
  };

  return (
    <div className="mt-2 flex gap-2">
      <Avatar
        src={currentUser?.avatar}
        alt={currentUser?.name || "Member"}
        initials={currentUser?.initials || "MB"}
        size="sm"
        className="mt-1 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Write a reply..."
          disabled={submitting}
          className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2 text-[16px] text-deep-blue placeholder:text-[13px] sm:text-[13px] outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
        />
        <div className="mt-1.5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
            {submitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineReplyBox;
