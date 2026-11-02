/** Post-type filter chips; scroll horizontally on phones. */
const FeedFilters = ({ filters, activeFilter, onChange }) => (
  <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
    {filters.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        aria-pressed={activeFilter === id}
        className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors sm:px-4 ${
          activeFilter === id
            ? 'bg-primary text-white'
            : 'border border-[#E4E7EC] bg-white text-[#475467] hover:border-primary/40'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default FeedFilters;
