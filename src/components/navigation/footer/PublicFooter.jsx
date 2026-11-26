import { Globe } from 'lucide-react';
import Container from '@/components/ui/Container';
import FooterBrand from './FooterBrand';
import FooterLinkColumn from './FooterLinkColumn';
import FooterPopularPosts from './FooterPopularPosts';
import FooterSocialLinks from './FooterSocialLinks';
import { FOOTER_COMPANY_LINKS, FOOTER_HELP_LINKS } from './constants';

/** Marketing / public-site footer (RootLayout). */
const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-slate-200/70 bg-white">
      <Container className="py-14 lg:py-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <FooterBrand />
          <FooterLinkColumn title="Company" links={FOOTER_COMPANY_LINKS} />
          <FooterLinkColumn title="Help" links={FOOTER_HELP_LINKS} />
          <FooterPopularPosts />
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-4 border-t border-slate-200/80 pt-6 sm:grid-cols-3">
          <p className="text-center text-[13px] text-slate-500 sm:text-left">
            © {currentYear} Lab Unity. All rights reserved.
          </p>
          <FooterSocialLinks />
          <span className="inline-flex items-center justify-center gap-1.5 text-[13px] text-slate-500 sm:justify-end">
            <Globe
              className="h-3.5 w-3.5 text-slate-400"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            English
          </span>
        </div>
      </Container>
    </footer>
  );
};

export default PublicFooter;
