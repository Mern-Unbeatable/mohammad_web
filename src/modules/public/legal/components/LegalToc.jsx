import { useEffect, useRef } from 'react';

/**
 * "On this page" list; highlights `activeId`. On large screens the panel sticks below the
 * public navbar and only the list scrolls, keeping the active item in view.
 */
const LegalToc = ({ title, sections, activeId, onSelect }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector('[aria-current="location"]');
    if (!list || !item || list.scrollHeight <= list.clientHeight) return;
    const itemTop = item.offsetTop - list.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    if (itemTop < list.scrollTop + 8) {
      list.scrollTo({ top: itemTop - 8, behavior: 'smooth' });
    } else if (itemBottom > list.scrollTop + list.clientHeight - 8) {
      list.scrollTo({ top: itemBottom - list.clientHeight + 8, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <nav
      aria-label={`${title} sections`}
      className="rounded-xl bg-white p-4 sm:p-5 lg:sticky lg:top-[100px] lg:flex lg:max-h-[calc(100vh-124px)] lg:flex-col xl:top-[108px] xl:max-h-[calc(100vh-132px)]"
    >
      <div className="flex shrink-0 items-center justify-between px-3 pb-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-deep-blue">
          On this page
        </p>
        <span className="text-[12px] text-[#98A2B3]">
          {sections.length} sections
        </span>
      </div>
      <ol
        ref={listRef}
        className="relative grid grid-cols-1 gap-1 border-t border-[#F0F2F5] pt-3 sm:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-1 lg:content-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1 [scrollbar-width:thin]"
      >
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
};

export default LegalToc;
