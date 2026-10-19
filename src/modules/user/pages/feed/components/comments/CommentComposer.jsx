import { useState } from "react";
import { Send } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

/** Top-level "Add a comment" box. `onSubmit` resolves `false` to keep the draft. */
const CommentComposer = ({ currentUser, onSubmit }) => {
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const ok = await onSubmit(text);
      if (ok !== false) setDraft("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-4 flex gap-2.5 sm:gap-3">
      <Avatar
        src={currentUser?.avatar}
        alt={currentUser?.name || "Member"}
        initials={currentUser?.initials || "MB"}
        size="md"
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Add a professional comment..."
          disabled={submitting}
          className="w-full resize-none rounded-lg border border-[#E4E7EC] px-3 py-2.5 text-[16px] text-deep-blue placeholder:text-[13px] sm:text-[13px] outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentComposer;
