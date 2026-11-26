import { Link } from 'react-router';
import { publicGeneralPostPath } from '@/modules/public/general';
import { useFooterPopularPosts } from './useFooterPopularPosts';

const FooterPopularPosts = () => {
  const { posts, loading } = useFooterPopularPosts();

  return (
    <div className="min-w-0">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Popular posts
      </p>

      {loading ? (
        <ul className="mt-5 space-y-5" aria-hidden="true">
          {[0, 1].map((key) => (
            <li key={key} className="flex items-start gap-3">
              <span className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-slate-100" />
              <span className="min-w-0 flex-1 space-y-2 pt-1">
                <span className="block h-3.5 w-full animate-pulse rounded bg-slate-100" />
                <span className="block h-3.5 w-4/5 animate-pulse rounded bg-slate-100" />
                <span className="block h-3 w-20 animate-pulse rounded bg-slate-100" />
              </span>
            </li>
          ))}
        </ul>
      ) : posts.length === 0 ? (
        <p className="mt-5 text-[14px] text-slate-400">No posts yet.</p>
      ) : (
        <ul className="mt-5 space-y-5">
          {posts.map((post) => (
            <li key={post.id} className="min-w-0">
              <Link
                to={publicGeneralPostPath(post.id)}
                title={post.title}
                className="group flex min-w-0 items-start gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                <span className="relative mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0 flex-1 overflow-hidden">
                  <span className="block truncate text-[14px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary">
                    {post.title}
                  </span>
                  <span className="mt-1.5 block truncate text-[12.5px] text-slate-400">
                    {post.date}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FooterPopularPosts;
