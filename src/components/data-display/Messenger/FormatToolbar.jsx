import { Bold, Code, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

const FORMAT_TOOLS = [
  { kind: "bold", label: "Bold", shortcut: "Ctrl+B", icon: <Bold className="h-4 w-4" /> },
  { kind: "italic", label: "Italic", shortcut: "Ctrl+I", icon: <Italic className="h-4 w-4" /> },
  { kind: "strike", label: "Strikethrough", icon: <Strikethrough className="h-4 w-4" /> },
  { kind: "code", label: "Inline code", shortcut: "Ctrl+E", icon: <Code className="h-4 w-4" /> },
  { kind: "bullet", label: "Bulleted list", icon: <List className="h-4 w-4" /> },
  { kind: "numbered", label: "Numbered list", icon: <ListOrdered className="h-4 w-4" /> },
];

/** Toolbar button that keeps the textarea's focus and selection while clicked. */
export const ComposerToolButton = ({ label, onClick, disabled = false, className = "", children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F2F4F7] hover:text-deep-blue disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

/** Bold / italic / strike / code / list buttons; `onFormat(kind)` applies the edit. */
const FormatToolbar = ({ onFormat, disabled = false, className = "" }) => (
  <div className={`flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] ${className}`}>
    {FORMAT_TOOLS.map(({ kind, label, shortcut, icon }) => (
      <ComposerToolButton
        key={kind}
        label={shortcut ? `${label} (${shortcut})` : label}
        onClick={() => onFormat?.(kind)}
        disabled={disabled}
      >
        {icon}
      </ComposerToolButton>
    ))}
  </div>
);

export default FormatToolbar;
