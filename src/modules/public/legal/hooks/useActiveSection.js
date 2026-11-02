import { useCallback, useEffect, useRef, useState } from 'react';
import { ACTIVE_SECTION_ROOT_MARGIN, TOC_SCROLL_LOCK_MS } from '../constant/constants';

/**
 * Id of the top-most section in view (first section until scrolling starts).
 * `select(id)` pins that id while the click-triggered smooth scroll runs, so sections
 * passing by on the way don't steal the highlight.
 */
export const useActiveSection = (ids) => {
  const [activeId, setActiveId] = useState(ids[0]);
  const lockedRef = useRef(false);
  const releaseRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (lockedRef.current) return;
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

  useEffect(() => () => releaseRef.current?.(), []);

  const select = useCallback((id) => {
    releaseRef.current?.();
    setActiveId(id);
    lockedRef.current = true;

    let timer;
    const release = () => {
      lockedRef.current = false;
      clearTimeout(timer);
      window.removeEventListener('scrollend', release);
      releaseRef.current = null;
    };
    timer = setTimeout(release, TOC_SCROLL_LOCK_MS);
    window.addEventListener('scrollend', release, { once: true });
    releaseRef.current = release;
  }, []);

  return [activeId, select];
};
