import { Calendar, MapPin } from "lucide-react";
import { postTypeLabel, postTypeStyle } from "../../utils/generalPosts";

/** Cover image, type pill, title, date and category. */
const PostHeader = ({ post }) => (
  <>
    {post.image ? (
      <img
        src={post.image}
        alt=""
        className="aspect-[21/9] w-full rounded-2xl object-cover sm:aspect-[16/7]"
      />
    ) : null}

    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${postTypeStyle(post.type)}`}
    >
      {postTypeLabel(post.type)}
    </span>

    <h1 className="text-[24px] font-bold leading-tight text-deep-blue sm:text-[28px]">
      {post.title}
    </h1>

    <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#98A2B3]">
      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {post.displayDate}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        {post.category}
      </span>
    </div>
  </>
);

export default PostHeader;
