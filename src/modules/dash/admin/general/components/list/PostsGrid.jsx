import { CardSkeleton } from "@/components/loader";
import GeneralPostCard from "@/components/data-display/GeneralPostCard/GeneralPostCard";
import { GENERAL_PAGE_SIZE, POST_GRID_CLASS, postDetailPath } from "../../constant/constants";

/** Skeletons on first load, an empty message, or the admin post cards. */
const PostsGrid = ({ items, loading, deleting, onDelete }) => {
  if (loading) {
    return <CardSkeleton variant="generalPost" count={GENERAL_PAGE_SIZE} className={POST_GRID_CLASS} />;
  }

  if (!items.length) {
    return (
      <p className="py-16 text-center text-sm text-[#64748B]">
        No general posts found for this filter.
      </p>
    );
  }

  return (
    <div className={POST_GRID_CLASS}>
      {items.map((post) => (
        <GeneralPostCard
          key={post.id}
          post={post}
          variant="admin"
          detailHref={postDetailPath(post.id)}
          onDelete={deleting ? undefined : onDelete}
        />
      ))}
    </div>
  );
};

export default PostsGrid;
