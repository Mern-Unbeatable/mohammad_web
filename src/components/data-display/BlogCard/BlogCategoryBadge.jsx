import { categoryStyles } from '@/modules/dash/user/data/blogs';

const FALLBACK_STYLE = 'bg-secondary text-primary ring-primary/15';

const BlogCategoryBadge = ({ category }) => (
  <span
    className={`inline-flex w-fit shrink-0 items-center self-start whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-wide ring-1 ring-inset sm:text-[11px] ${
      categoryStyles[category] || FALLBACK_STYLE
    }`}
  >
    {category}
  </span>
);

export default BlogCategoryBadge;
