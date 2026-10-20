import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import {
  MAX_MESSAGE_LENGTH,
  applyComposerFormat,
  continueList,
  formatShortcutFor,
} from "@/features/messages/composerFormat";
import FormatToolbar from "./FormatToolbar";

/**
 * `onSave(body)` resolves true when saved; `canBeEmpty` allows clearing the text
 * when an attachment or listing remains on the message.
 */
const EditMessageDialog = ({ initialText = "", canBeEmpty = false, onSave, onClose }) => {
  const [value, setValue] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const body = value.trim();
  const unchanged = body === initialText.trim();
  const canSave = !saving && !unchanged && (body.length > 0 || canBeEmpty);

  const close = () => {
    if (!saving) onClose?.();
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    const ok = await onSave?.(body);
    setSaving(false);
    if (ok) onClose?.();
  };

  const replaceValue = (next, selectionStart, selectionEnd = selectionStart) => {
    if (next.length > MAX_MESSAGE_LENGTH) return;
    setValue(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const applyFormat = (kind) => {
    const el = ref.current;
    if (!el) return;
    const next = applyComposerFormat(value, el.selectionStart, el.selectionEnd, kind);
    replaceValue(next.value, next.selectionStart, next.selectionEnd);
  };

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    const shortcut = formatShortcutFor(e);
    if (shortcut) {
      e.preventDefault();
      applyFormat(shortcut);
      return;
    }
    if (e.key !== "Enter") return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      save();
      return;
    }
    const el = e.currentTarget;
    if (el.selectionStart !== el.selectionEnd) return;
    const next = continueList(value, el.selectionStart);
    if (!next) return;
    e.preventDefault();
    replaceValue(next.value, next.caret);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-message-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[640px] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
              <Pencil className="h-4 w-4" />
            </span>
            <h2 id="edit-message-title" className="text-[16px] font-bold text-deep-blue">
              Edit message
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-xl border border-[#E4E7EC] transition-shadow focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
            <textarea
              ref={ref}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={saving}
              aria-label="Edit message"
              placeholder="Write a message..."
              className="block max-h-[50dvh] min-h-[160px] w-full resize-none overflow-y-auto rounded-t-xl bg-transparent px-4 py-3 text-[14px] leading-6 text-deep-blue outline-none [scrollbar-width:thin] placeholder:text-[#98A2B3] disabled:opacity-70"
            />
            <div className="flex items-center gap-2 border-t border-[#F2F4F7] px-2 py-1.5">
              <FormatToolbar onFormat={applyFormat} disabled={saving} />
              <span className="ml-auto shrink-0 pr-2 text-[11px] tabular-nums text-[#98A2B3]">
                {value.length.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()}
              </span>
            </div>
          </div>
          {!canBeEmpty && !body ? (
            <p className="mt-2 text-[12px] text-[#CC1016]">A message can't be empty.</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-[#E4E7EC] px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <span className="hidden text-[11px] text-[#98A2B3] sm:inline">
            <kbd className="font-sans font-semibold">Ctrl + Enter</kbd> to save ·{" "}
            <kbd className="font-sans font-semibold">Esc</kbd> to cancel
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={close}
              disabled={saving}
              className="rounded-lg border border-[#E4E7EC] px-4 py-2 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              aria-busy={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Modal for editing one of your sent messages. */
const EditMessageModal = ({ open, ...props }) => (open ? <EditMessageDialog {...props} /> : null);

export default EditMessageModal;
