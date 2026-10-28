import { Fragment } from 'react';
import { Link } from 'react-router';
import { Globe } from 'lucide-react';
import logo from '@/assets/logo.png';
import Container from '@/components/ui/Container';
import { PRIVACY_PATH, TERMS_PATH } from '@/modules/public/legal';
import { CONTACT_PATH } from '@/modules/public/contact';

const FOOTER_LINKS = [
  { to: TERMS_PATH, label: 'Terms of Service' },
  { to: PRIVACY_PATH, label: 'Privacy Policy' },
  { to: CONTACT_PATH, label: 'Contact Us' },
];

const linkClass =
  'rounded-sm text-[13px] font-medium text-[#475467] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:text-[14px]';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto w-full border-t border-[#E4E7EC] bg-[#F7F8FA]">
      <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row lg:py-7">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <Link to="/" aria-label="Lab Unity home" className="shrink-0">
            <img src={logo} alt="Lab Unity" className="h-8 w-auto object-contain mix-blend-multiply" />
          </Link>
          <p className="text-center text-[13px] text-[#667085] sm:border-l sm:border-[#E4E7EC] sm:pl-4 lg:text-[14px]">
            © {currentYear} Lab Unity. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {FOOTER_LINKS.map(({ to, label }, index) => (
            <Fragment key={to}>
              {index > 0 && <span aria-hidden="true" className="h-4 w-px bg-[#D0D5DD]" />}
              <Link to={to} className={linkClass}>
                {label}
              </Link>
            </Fragment>
          ))}
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-[13px] font-medium text-[#475467] lg:text-[14px]">
            <Globe className="h-3.5 w-3.5 text-[#98A2B3]" strokeWidth={2.25} />
            English
          </span>
        </nav>
      </Container>
    </footer>
  );
};

export default AppFooter;
