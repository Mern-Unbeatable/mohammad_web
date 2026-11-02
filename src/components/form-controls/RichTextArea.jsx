import { useRef } from "react";
import {
  applyComposerFormat,
  continueList,
  formatShortcutFor,
} from "@/features/messages/composerFormat";
import FormatToolbar from "@/components/data-display/Messenger/FormatToolbar";

/**
 * Textarea with a bold / italic / strike / code / list toolbar. The value stays plain
 * text with lightweight markers; render it with `RichText`.
 */
const RichTextArea = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
  maxLength,
  className = "",
}) => {
  const ref = useRef(null);

  const replaceValue = (next, selectionStart, selectionEnd = selectionStart) => {
    if (maxLength && next.length > maxLength) return;
    onChange(next);
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
    const next = applyComposerFormat(
      value,
      el.selectionStart,
      el.selectionEnd,
      kind,
    );
    replaceValue(next.value, next.selectionStart, next.selectionEnd);
  };

  const handleKeyDown = (e) => {
    const shortcut = formatShortcutFor(e);
    if (shortcut) {
      e.preventDefault();
      applyFormat(shortcut);
      return;
    }
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    const el = e.currentTarget;
    if (el.selectionStart !== el.selectionEnd) return;
    const next = continueList(value, el.selectionStart);
    if (!next) return;
    e.preventDefault();
    replaceValue(next.value, next.caret);
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border border-[#D0D5DD] bg-white transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${className}`}
    >
      <FormatToolbar
        onFormat={applyFormat}
        className="border-b border-[#E4E7EC] bg-[#F9FAFB] px-1.5 py-1"
      />
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className="block w-full resize-y border-0 px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3]"
      />
    </div>
  );
};

export default RichTextArea;
