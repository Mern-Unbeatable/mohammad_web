import { useEffect, useState } from 'react';
import { ACTIVE_SECTION_ROOT_MARGIN } from '../constant/constants';

/** Id of the top-most section in view (first section until scrolling starts); settable on TOC click. */
export const useActiveSection = (ids) => {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: ACTIVE_SECTION_ROOT_MARGIN },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [ids]);

  return [activeId, setActiveId];
};
