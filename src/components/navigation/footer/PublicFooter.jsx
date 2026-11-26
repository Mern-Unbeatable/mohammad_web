import { Globe } from "lucide-react";
import Container from "@/components/ui/Container";
import FooterBrand from "./FooterBrand";
import FooterLinkColumn from "./FooterLinkColumn";
import FooterPopularPosts from "./FooterPopularPosts";
import FooterSocialLinks from "./FooterSocialLinks";
import { FOOTER_COMPANY_LINKS, FOOTER_HELP_LINKS } from "./constants";

/** Marketing / public-site footer (RootLayout). */
const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-slate-200/70 bg-slate-100">
      <Container className="py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-10 xl:gap-12">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <FooterBrand />
          </div>
          <FooterLinkColumn title="Platform" links={FOOTER_COMPANY_LINKS} />
          <FooterLinkColumn title="Help" links={FOOTER_HELP_LINKS} />
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <FooterPopularPosts />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-5 border-t border-slate-200/80 pt-6 sm:mt-10 md:flex-row md:justify-between md:gap-4">
          <p className="order-2 text-center text-[12.5px] text-slate-500 sm:text-[13px] md:order-1 md:text-left">
            © {currentYear} Lab Unity. All rights reserved.
          </p>
          <div className="order-1 md:order-2">
            <FooterSocialLinks />
          </div>
          <span className="order-3 inline-flex items-center justify-center gap-1.5 text-[12.5px] text-slate-500 sm:text-[13px] md:justify-end">
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
