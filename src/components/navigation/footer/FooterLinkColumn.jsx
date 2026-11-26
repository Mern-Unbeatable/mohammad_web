import { Link } from 'react-router';

const linkClass =
  'inline-flex min-h-10 items-center text-[14px] text-slate-800 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm sm:min-h-0 sm:text-[15px]';

const FooterLinkColumn = ({ title, links }) => (
  <div className="min-w-0">
    <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[12px]">
      {title}
    </p>
    <ul className="mt-3 space-y-1 sm:mt-5 sm:space-y-3.5">
      {links.map(({ to, label, fullLabel, key }) => (
        <li key={key ?? `${to}-${label}`}>
          <Link to={to} className={linkClass} title={fullLabel}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterLinkColumn;
