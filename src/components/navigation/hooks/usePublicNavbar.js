import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import { PUBLIC_NAV_LINKS, PUBLIC_TOP_SECTION } from '../constant/constants';

const HOME_PATH = '/';
const SECTION_IDS = PUBLIC_NAV_LINKS.map((link) => link.sectionId);
/** A section counts as current once its top passes this far below the viewport top. */
const SPY_OFFSET = 140;
/** Ignore scroll-spy updates while a click-triggered smooth scroll is running. */
const CLICK_LOCK_MS = 900;

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${sectionId}`);
  }
};

const findCurrentSection = () => {
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom) return SECTION_IDS[SECTION_IDS.length - 1];

  let current = SECTION_IDS[0];
  for (const id of SECTION_IDS) {
    const element = document.getElementById(id);
    if (element && element.getBoundingClientRect().top - SPY_OFFSET <= 0) current = id;
  }
  return current;
};

/**
 * Public navbar: mobile menu (locks body scroll), section links that scroll on
 * the home page or navigate to `/#section` elsewhere, hash scrolling on arrival,
 * and `activeSection` tracking which home section is on screen.
 */
export const usePublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0]);
  const lockUntil = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === HOME_PATH;

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    if (location.pathname !== HOME_PATH || !location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const timer = window.setTimeout(() => {
      if (SECTION_IDS.includes(sectionId)) {
        setActiveSection(sectionId);
        lockUntil.current = Date.now() + CLICK_LOCK_MS;
      }
      scrollToSection(sectionId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!onHome) return undefined;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (Date.now() < lockUntil.current) return;
        setActiveSection(findCurrentSection());
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [onHome]);

  const handleSectionNav = (sectionId) => (event) => {
    event.preventDefault();
    closeMenu();

    if (onHome) {
      setActiveSection(sectionId);
      lockUntil.current = Date.now() + CLICK_LOCK_MS;
      scrollToSection(sectionId);
      return;
    }

    navigate(`/#${sectionId}`);
  };

  const handleLogoClick = (event) => {
    if (onHome) {
      event.preventDefault();
      setActiveSection(PUBLIC_TOP_SECTION);
      lockUntil.current = Date.now() + CLICK_LOCK_MS;
      scrollToSection(PUBLIC_TOP_SECTION);
    }
    closeMenu();
  };

  return {
    menuOpen,
    closeMenu,
    toggleMenu,
    handleSectionNav,
    handleLogoClick,
    activeSection: onHome ? activeSection : null,
  };
};
