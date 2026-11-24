/** Post-type filter chips; equal-width on phones, wrap freely from `sm` up. */
const FeedFilters = ({ filters, activeFilter, onChange }) => (
  <div className="-mx-2 flex gap-1 overflow-x-auto px-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
    {filters.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        aria-pressed={activeFilter === id}
        className={`min-w-0 flex-1 whitespace-nowrap rounded-full px-2 py-1.5 text-center text-[12px] font-semibold transition-colors sm:flex-none sm:px-4 sm:text-[13px] ${
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
