/** Underlined tab row; each tab is `{ id, label, icon, count? }`. */
const ActivityTabBar = ({ tabs, activeId, onChange, className = "" }) => (
  <div
    role="tablist"
    className={`flex gap-1 border-b border-[#E4E7EC] px-3 pt-2 sm:px-4 ${className}`}
  >
    {tabs.map((item) => {
      const selected = item.id === activeId;
      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(item.id)}
          className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors ${
            selected
              ? "border-primary text-primary"
              : "border-transparent text-[#64748B] hover:text-deep-blue"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.count != null ? (
            <span
              className={`rounded-full px-1.5 py-px text-[11px] ${
                selected
                  ? "bg-secondary text-primary"
                  : "bg-[#F3F4F6] text-[#64748B]"
              }`}
            >
              {item.count}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);

export default ActivityTabBar;
