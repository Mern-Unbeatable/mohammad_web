import Container from '@/components/ui/Container';
import PublicAuthActions from './PublicAuthActions';
import { PUBLIC_NAV_LINKS } from '../../constant/constants';

/** Backdrop + slide-down drawer below the navbar (hidden from `lg`). */
const PublicMobileMenu = ({ open, onClose, onSectionNav, activeSection }) => (
  <>
    <div
      aria-hidden="true"
      onClick={onClose}
      className={`fixed inset-0 z-[60] bg-[#0A1A44]/45 transition-opacity duration-300 ease-out lg:hidden ${
        open
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
    />

    <div
      className={`fixed left-0 right-0 top-[72px] z-[65] w-full border-b border-[#F0F0F0] bg-white shadow-[0_12px_32px_rgba(10,26,68,0.1)] transition-all duration-300 ease-out lg:hidden ${
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0'
      }`}
    >
      <Container className="py-5">
        <ul className="flex flex-col gap-4">
          {PUBLIC_NAV_LINKS.map(({ label, sectionId }) => (
            <li key={label}>
              <a
                href={`/#${sectionId}`}
                onClick={onSectionNav(sectionId)}
                aria-current={activeSection === sectionId ? 'location' : undefined}
                className={`block text-[16px] leading-none transition-colors ${
                  activeSection === sectionId
                    ? 'font-medium text-primary'
                    : 'font-normal text-[#6B7280] hover:text-primary'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <PublicAuthActions
          variant="mobile"
          onNavigate={onClose}
          className="mt-5 flex flex-col gap-3 border-t border-[#F0F0F0] pt-5"
        />
      </Container>
    </div>
  </>
);

export default PublicMobileMenu;
