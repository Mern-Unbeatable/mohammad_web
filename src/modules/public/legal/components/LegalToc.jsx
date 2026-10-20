/** Sticky "On this page" list; highlights `activeId`. */
const LegalToc = ({ title, sections, activeId, onSelect }) => (
  <nav
    aria-label={`${title} sections`}
    className="rounded-xl bg-white p-4 sm:p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto"
  >
    <div className="flex items-center justify-between px-3 pb-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-deep-blue">
        On this page
      </p>
      <span className="text-[12px] text-[#98A2B3]">
        {sections.length} sections
      </span>
    </div>
    <ol className="grid grid-cols-1 gap-1 border-t border-[#F0F2F5] pt-3 sm:grid-cols-2 lg:grid-cols-1">
      {sections.map(({ id, heading }, index) => {
        const isActive = id === activeId;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={() => onSelect(id)}
              aria-current={isActive ? 'location' : undefined}
              className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-[15px] leading-[1.45] transition-colors ${
                isActive
                  ? 'bg-secondary font-medium text-primary'
                  : 'text-[#475467] hover:bg-[#F7F8FA] hover:text-deep-blue'
              }`}
            >
              <span
                className={`min-w-[1.5rem] shrink-0 tabular-nums ${
                  isActive ? 'text-primary' : 'text-[#98A2B3]'
                }`}
              >
                {index + 1}.
              </span>
              <span>{heading}</span>
            </a>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default LegalToc;
