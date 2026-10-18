import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Loader2, Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import Container from '@/components/ui/Container';
import { useAuth } from '@/shared/auth/useAuth';


const navLinks = [
  { label: 'Platform', sectionId: 'platform', active: true },
  { label: 'Community', sectionId: 'community' },
  { label: 'Marketplace', sectionId: 'marketplace' },
];

const AuthActions = ({ onNavigate, className = '' }) => {
  const { isAuthenticated, isSupplier, isAdmin, homePath, logout, loggingOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!(await logout())) return;
    onNavigate?.();
    navigate('/', { replace: true });
  };

  if (isAuthenticated) {
    const isSupplierOrAdmin = isSupplier || isAdmin;

    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className="inline-flex items-center gap-1.5 text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary disabled:cursor-wait disabled:opacity-70 xl:text-[16px]"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loggingOut ? 'Logging out…' : 'Log out'}
        </button>
        {isSupplierOrAdmin ? (
          <Link
            to={homePath}
            onClick={onNavigate}
            className="rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-none text-white transition-opacity hover:opacity-90 xl:px-8 xl:py-3 xl:text-[15px]"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/feed"
            onClick={onNavigate}
            className="rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-none text-white transition-opacity hover:opacity-90 xl:px-8 xl:py-3 xl:text-[15px]"
          >
            Feed
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <Link
        to="/login"
        onClick={onNavigate}
        className="text-[15px] font-normal leading-none text-deep-blue transition-colors hover:text-primary xl:text-[16px]"
      >
        Log in
      </Link>
      <Link
        to="/join"
        onClick={onNavigate}
        className="rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium leading-none text-white transition-opacity hover:opacity-90 xl:px-8 xl:py-3 xl:text-[15px]"
      >
        Join Lab Unity
      </Link>
    </div>
  );
};


const NavbarLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  const handleSectionNav = (sectionId) => (event) => {
    event.preventDefault();
    closeMenu();

    if (location.pathname === '/') {
      scrollToSection(sectionId);
      return;
    }

    navigate(`/#${sectionId}`);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const timer = window.setTimeout(() => scrollToSection(sectionId), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <>
      <nav className="sticky top-0 z-[70] w-full border-b border-[#F0F0F0] bg-white/95 backdrop-blur-sm">
        <Container className="flex h-[72px] items-center justify-between lg:h-[76px] xl:h-[84px]">
          <div className="flex items-center gap-10 lg:gap-8 xl:gap-14">
            <Link
              to="/"
              className="shrink-0"
              onClick={(event) => {
                if (location.pathname === '/') {
                  event.preventDefault();
                  scrollToSection('platform');
                }
                closeMenu();
              }}
            >
              <img
                src={logo}
                alt="Lab Unity"
                className="h-[38px] w-auto object-contain lg:h-[42px] xl:h-[48px]"
              />
            </Link>

            <ul className="hidden items-center gap-8 lg:flex lg:gap-6 xl:gap-10">
              {navLinks.map(({ label, sectionId, active }) => (
                <li key={label}>
                  <a
                    href={`/#${sectionId}`}
                    onClick={handleSectionNav(sectionId)}
                    className={`text-[15px] leading-none transition-colors xl:text-[16px] ${
                      active
                        ? 'font-medium text-primary'
                        : 'font-normal text-[#6B7280] hover:text-primary'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <AuthActions
            onNavigate={closeMenu}
            className="hidden items-center gap-6 lg:flex lg:gap-5 xl:gap-8"
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

      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-[#0A1A44]/45 transition-opacity duration-300 ease-out lg:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed left-0 right-0 top-[72px] z-[65] w-full border-b border-[#F0F0F0] bg-white shadow-[0_12px_32px_rgba(10,26,68,0.1)] transition-all duration-300 ease-out lg:hidden ${
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <Container className="py-5">
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ label, sectionId, active }) => (
              <li key={label}>
                <a
                  href={`/#${sectionId}`}
                  onClick={handleSectionNav(sectionId)}
                  className={`block text-[16px] leading-none transition-colors ${
                    active
                      ? 'font-medium text-primary'
                      : 'font-normal text-[#6B7280] hover:text-primary'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <AuthActions
            onNavigate={closeMenu}
            className="mt-5 flex flex-col gap-3 border-t border-[#F0F0F0] pt-5 [&_a:last-child]:text-center [&_button]:text-center"
          />
        </Container>
      </div>
    </>
  );
};

export default NavbarLayout;
