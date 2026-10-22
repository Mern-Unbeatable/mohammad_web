import { Link } from 'react-router';
import { Calendar } from 'lucide-react';
import { RelatedPostsSkeleton } from '@/components/loader';
import { generalPostPath, POST_TYPE, POST_TYPE_STYLES } from '../../constant/constants';

/** Compact list of other posts; hidden once loaded if there are none. */
const RelatedPosts = ({ loading, items }) => {
  if (loading) return <RelatedPostsSkeleton />;
  if (!items.length) return null;

  return (
    <section className="rounded-xl border border-[#E4E7EC] bg-white p-4">
      <h2 className="text-[18px] font-bold text-deep-blue">Related posts</h2>
      <ul className="mt-3 space-y-4">
        {items.map((post) => (
          <li key={post.id}>
            <Link
              to={generalPostPath(post.id)}
              className="group flex gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <img
                src={post.image}
                alt=""
                loading="lazy"
                className="h-16 w-20 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <span
                  className={`inline-flex rounded-full px-2 py-px text-[9px] font-semibold uppercase tracking-wide ${
                    POST_TYPE_STYLES[post.type] || POST_TYPE_STYLES[POST_TYPE.NEWS]
                  }`}
                >
                  {post.type === POST_TYPE.DOCUMENT ? 'Document' : 'News'}
                </span>
                <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-deep-blue group-hover:text-primary">
                  {post.title}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[#98A2B3]">
                  <Calendar className="h-3 w-3" />
                  {post.displayDate}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedPosts;
