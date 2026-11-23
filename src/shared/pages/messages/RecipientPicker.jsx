import { useEffect, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Searchable list of people the current user can message.
 * `selected` is an array of user ids; `multiple` switches radio → checkbox.
 */
const RecipientPicker = ({
  recipients = [],
  loading = false,
  selected = [],
  onChange,
  onSearch,
  multiple = false,
  excludeIds = [],
  emptyText = "No contacts found. Connect with people to message them.",
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () => onSearch?.(query.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const visible = recipients.filter((r) => !excludeIds.includes(r.id));

  const toggle = (id) => {
    if (!multiple) {
      onChange?.([id]);
      return;
    }
    onChange?.(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  };

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-[#E4E7EC] bg-white py-2.5 pl-9 pr-3 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <ul
        className="mt-2 max-h-[400px] space-y-0.5 overflow-y-auto px-2"
        role="listbox"
        aria-multiselectable={multiple}
      >
        {loading && visible.length === 0 ? (
          <li className="flex items-center justify-center py-6 text-[#98A2B3]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </li>
        ) : visible.length === 0 ? (
          <li className="px-2 py-6 text-center text-[13px] text-[#64748B]">
            {emptyText}
          </li>
        ) : (
          visible.map((recipient) => {
            const isSelected = selected.includes(recipient.id);
            return (
              <li key={recipient.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(recipient.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                    isSelected ? "bg-secondary" : "hover:bg-[#F9FAFB]"
                  }`}
                >
                  <Avatar
                    src={recipient.avatar}
                    alt={recipient.name}
                    initials={recipient.initials}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-deep-blue">
                      {recipient.name}
                    </span>
                    {recipient.subtitle ? (
                      <span className="block truncate text-[12px] text-[#64748B]">
                        {recipient.subtitle}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-[#D0D5DD]"
                    }`}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : null}
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default RecipientPicker;
