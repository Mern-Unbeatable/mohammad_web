import { useState } from "react";
import { MAX_COMMENT_LENGTH } from "../../constants";
import { useFocusAtEnd } from "../../hooks/useFocusAtEnd";

/** In-place comment editor: Esc cancels, Ctrl/Cmd+Enter saves. */
const CommentEditForm = ({ initialValue, saving, onSave, onCancel }) => {
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useFocusAtEnd();
  const empty = !draft.trim();

  const handleSave = () => {
    if (empty || saving) return;
    onSave(draft.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && !saving) {
      event.preventDefault();
      onCancel();
    } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  return (
    <div>
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={saving}
        aria-label="Edit comment"
        aria-invalid={empty}
        className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-[16px] text-deep-blue outline-none focus:ring-2 disabled:opacity-60 sm:text-[13px] ${
          empty
            ? "border-[#FDA29B] focus:border-[#F04438] focus:ring-[#F04438]/10"
            : "border-[#E4E7EC] focus:border-primary focus:ring-primary/10"
        }`}
      />
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="min-w-0 text-[11px] text-[#98A2B3]">
          {empty ? (
            <span className="text-[#D92D20]">Comment can&apos;t be empty</span>
          ) : (
            <span className="hidden sm:inline">Esc to cancel</span>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#64748B] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={empty || saving}
            className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentEditForm;
