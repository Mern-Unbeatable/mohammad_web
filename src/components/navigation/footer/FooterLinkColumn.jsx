import { Link } from 'react-router';

const linkClass =
  'text-[15px] text-slate-800 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm';

const FooterLinkColumn = ({ title, links }) => (
  <div>
    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {title}
    </p>
    <ul className="mt-5 space-y-3.5">
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
