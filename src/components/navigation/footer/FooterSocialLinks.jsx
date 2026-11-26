import { FOOTER_SOCIAL_LINKS } from './constants';

const FooterSocialLinks = () => (
  <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
    {FOOTER_SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
      <li key={label}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-10 sm:w-10"
        >
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

export default FooterSocialLinks;
