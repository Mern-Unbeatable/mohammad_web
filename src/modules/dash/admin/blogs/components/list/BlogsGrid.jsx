import { CardSkeleton } from "@/components/loader";
import BlogAdminCard from "@/components/data-display/BlogAdminCard/BlogAdminCard";
import { BLOGS_PAGE_SIZE, BLOG_GRID_CLASS } from "../../constant/constants";

/** Skeletons on first load, an empty message, or the admin blog cards. */
const BlogsGrid = ({ items, loading, deleting, onEdit, onDelete }) => {
  if (loading) {
    return <CardSkeleton variant="generalPost" count={BLOGS_PAGE_SIZE} className={BLOG_GRID_CLASS} />;
  }

  if (!items.length) {
    return (
      <p className="py-16 text-center text-sm text-[#64748B]">
        No blog posts yet. Create your first article.
      </p>
    );
  }

  return (
    <div className={BLOG_GRID_CLASS}>
      {items.map((article) => (
        <BlogAdminCard
          key={article.id}
          article={article}
          onEdit={onEdit}
          onDelete={deleting ? undefined : onDelete}
        />
      ))}
    </div>
  );
};

export default BlogsGrid;
