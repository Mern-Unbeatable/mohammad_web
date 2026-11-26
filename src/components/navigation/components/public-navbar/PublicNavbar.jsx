import { useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import Container from '@/components/ui/Container';
import { useAuth } from '@/modules/auth';
import PublicAuthActions from './PublicAuthActions';
import PublicMobileMenu from './PublicMobileMenu';
import { usePublicNavbar } from '../../hooks/usePublicNavbar';
import { PUBLIC_NAV_LINKS } from '../../constant/constants';

/** Marketing-site navbar (home, legal pages): logo, section links, auth actions, mobile menu. */
const PublicNavbar = () => {
  const { menuOpen, closeMenu, toggleMenu, handleSectionNav, handleLogoClick, activeSection } =
    usePublicNavbar();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navLinks = useMemo(
    () =>
      PUBLIC_NAV_LINKS.filter((link) => !(link.guestOnly && isAuthenticated)),
    [isAuthenticated],
  );

  return (
    <>
      <nav className="relative z-[70] w-full border-b border-[#F0F0F0] bg-white/95 backdrop-blur-sm">
        <Container className="flex h-[72px] items-center justify-between lg:h-[76px] xl:h-[84px]">
          <div className="flex h-full items-center gap-10 lg:gap-8 xl:gap-14">
            <Link to="/" className="shrink-0" onClick={handleLogoClick}>
              <img
                src={logo}
                alt="Lab Unity"
                className="h-[38px] w-auto object-contain lg:h-[42px] xl:h-[48px]"
              />
            </Link>

            <ul className="hidden h-full items-center gap-8 lg:flex lg:gap-6 xl:gap-10">
              {navLinks.map((link) => {
                if (link.to) {
                  const active =
                    location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`);
                  return (
                    <li key={link.label} className="h-full">
                      <Link
                        to={link.to}
                        aria-current={active ? 'page' : undefined}
                        className={`relative flex h-full items-center text-[15px] leading-none transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors xl:text-[16px] ${
                          active
                            ? 'font-medium text-primary after:bg-primary'
                            : 'font-normal text-[#6B7280] after:bg-transparent hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                }

                const active = activeSection === link.sectionId;
                return (
                  <li key={link.label} className="h-full">
                    <a
                      href={`/#${link.sectionId}`}
                      onClick={handleSectionNav(link.sectionId)}
                      aria-current={active ? 'location' : undefined}
                      className={`relative flex h-full items-center text-[15px] leading-none transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors xl:text-[16px] ${
                        active
                          ? 'font-medium text-primary after:bg-primary'
                          : 'font-normal text-[#6B7280] after:bg-transparent hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <PublicAuthActions
            onNavigate={closeMenu}
            className="hidden items-center gap-3 lg:flex"
          />

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-deep-blue transition-colors lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </Container>
      </nav>

      <PublicMobileMenu
        open={menuOpen}
        onClose={closeMenu}
        onSectionNav={handleSectionNav}
        activeSection={activeSection}
        links={navLinks}
      />
    </>
  );
};

export default PublicNavbar;
