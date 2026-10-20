import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useBodyScrollLock } from './useBodyScrollLock';
import { PUBLIC_TOP_SECTION } from '../constant/constants';

const HOME_PATH = '/';

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${sectionId}`);
  }
};

/**
 * Public navbar: mobile menu (locks body scroll), section links that scroll on
 * the home page or navigate to `/#section` elsewhere, and hash scrolling on arrival.
 */
export const usePublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === HOME_PATH;

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    if (location.pathname !== HOME_PATH || !location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const timer = window.setTimeout(() => scrollToSection(sectionId), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const handleSectionNav = (sectionId) => (event) => {
    event.preventDefault();
    closeMenu();

    if (onHome) {
      scrollToSection(sectionId);
      return;
    }

    navigate(`/#${sectionId}`);
  };

  const handleLogoClick = (event) => {
    if (onHome) {
      event.preventDefault();
      scrollToSection(PUBLIC_TOP_SECTION);
    }
    closeMenu();
  };

  return { menuOpen, closeMenu, toggleMenu, handleSectionNav, handleLogoClick };
};
