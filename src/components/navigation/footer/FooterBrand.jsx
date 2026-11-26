import { Link } from "react-router";
import logo from "@/assets/logo.png";
import { FOOTER_SOCIAL_LINKS, FOOTER_TAGLINE } from "./constants";

const FooterBrand = () => (
  <div className="max-w-sm">
    <Link to="/" aria-label="Lab Unity home" className="inline-block shrink-0">
      <img
        src={logo}
        alt="Lab Unity"
        className="h-20 w-auto object-contain mix-blend-multiply"
      />
    </Link>
    <p className="mt-5 text-[14px] leading-relaxed text-slate-500">
      {FOOTER_TAGLINE}
    </p>
    <ul className="mt-6 flex items-center gap-3">
      {FOOTER_SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterBrand;
