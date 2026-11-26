import { Link } from 'react-router';
import logo from '@/assets/logo.png';
import { FOOTER_TAGLINE } from './constants';

const FooterBrand = () => (
  <div className="max-w-sm">
    <Link to="/" aria-label="Lab Unity home" className="inline-block shrink-0">
      <img
        src={logo}
        alt="Lab Unity"
        className="h-20 w-auto object-contain mix-blend-multiply"
      />
    </Link>
    <p className="mt-5 text-[14px] leading-relaxed text-slate-500">{FOOTER_TAGLINE}</p>
  </div>
);

export default FooterBrand;
