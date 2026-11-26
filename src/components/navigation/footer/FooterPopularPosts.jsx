import { Link } from 'react-router';
import { FOOTER_POPULAR_POSTS } from './constants';

const FooterPopularPosts = () => (
  <div>
    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      Popular posts
    </p>
    <ul className="mt-5 space-y-6">
      {FOOTER_POPULAR_POSTS.map(({ to, title, date }) => (
        <li key={title}>
          <Link
            to={to}
            className="block text-[15px] font-semibold leading-snug text-slate-900 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
          >
            {title}
          </Link>
          <p className="mt-1.5 text-[13px] text-slate-400">{date}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterPopularPosts;
