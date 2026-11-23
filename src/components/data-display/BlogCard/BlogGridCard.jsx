import { Link } from 'react-router';
import { ArrowRight, Clock } from 'lucide-react';
import BlogCategoryBadge from './BlogCategoryBadge';
import { blogCardTheme } from './blogCardTheme';

const BlogGridCard = ({ article, blogBasePath = '/blogs' }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
    <Link to={`${blogBasePath}/${article.slug}`} className="block overflow-hidden">
      <img
        src={article.image}
        alt=""
        className="aspect-[16/10] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
      />
    </Link>

    <div className={`flex flex-1 flex-col ${blogCardTheme.bodyPad}`}>
      <BlogCategoryBadge category={article.category} />
      <Link to={`${blogBasePath}/${article.slug}`}>
        <h3 className={`mt-2 hover:text-primary sm:mt-3 ${blogCardTheme.title}`}>
          {article.title}
        </h3>
      </Link>
      <p className={`mt-2 flex-1 ${blogCardTheme.excerpt}`}>{article.excerpt}</p>

      <div className="mt-3 flex flex-col gap-3 border-t border-[#E4E7EC] pt-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deep-blue text-[11px] font-semibold text-white sm:text-[12px] lg:text-[13px]">
            {article.authorInitials || 'MO'}
          </span>
          <div className="min-w-0">
            <p className={`truncate ${blogCardTheme.author}`}>{article.author}</p>
            <p className={`flex flex-wrap items-center gap-x-1 gap-y-0.5 ${blogCardTheme.meta}`}>
              <span>{article.date}</span>
              <span className="text-[#D0D5DD]">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </p>
          </div>
        </div>
        <Link
          to={`${blogBasePath}/${article.slug}`}
          className={`inline-flex shrink-0 items-center gap-1 self-start text-primary hover:underline sm:self-auto ${blogCardTheme.action}`}
        >
          Read
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </article>
);

export default BlogGridCard;
