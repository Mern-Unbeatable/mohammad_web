import { Link } from 'react-router';
import Container from '@/components/ui/Container';
import { PRIVACY_PATH, TERMS_PATH } from '@/shared/constants/legal';

const linkClass =
  'text-[13px] text-[#475467] transition-colors hover:text-deep-blue lg:text-[14px]';

const FooterLayout = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto w-full border-t border-[#E4E7EC] bg-[#F7F8FA]">
      <Container className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row lg:py-6">
        <p className="text-[13px] text-[#475467] lg:text-[14px]">
          © {currentYear} Lab Unity. All Rights Reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link to={TERMS_PATH} className={linkClass}>
            Terms of Service
          </Link>
          <Link to={PRIVACY_PATH} className={linkClass}>
            Privacy Policy
          </Link>
          <button type="button" className={linkClass}>
            English
          </button>
        </div>
      </Container>
    </footer>
  );
};

export default FooterLayout;
