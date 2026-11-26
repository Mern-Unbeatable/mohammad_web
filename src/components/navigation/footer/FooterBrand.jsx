import { Link } from 'react-router';
import logo from '@/assets/logo.png';
import { FOOTER_TAGLINE } from './constants';

const FooterBrand = () => (
  <div className="mx-auto max-w-md text-center sm:mx-0 sm:max-w-sm sm:text-left lg:max-w-xs xl:max-w-sm">
    <Link to="/" aria-label="Lab Unity home" className="inline-block shrink-0">
      <img
        src={logo}
        alt="Lab Unity"
        className="mx-auto h-14 w-auto object-contain mix-blend-multiply sm:mx-0 sm:h-16 lg:h-[4.5rem]"
      />
    </Link>
    <p className="mt-4 text-[13.5px] leading-relaxed text-slate-500 sm:mt-5 sm:text-[14px]">
      {FOOTER_TAGLINE}
    </p>
  </div>
);

export default FooterBrand;
