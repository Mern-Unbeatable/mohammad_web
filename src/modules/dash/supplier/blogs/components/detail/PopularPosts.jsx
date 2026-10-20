import { Link } from "react-router";
import { blogDetailPath } from "../../constant/constants";

const PopularPosts = ({ posts }) => (
  <aside className="min-w-0 lg:sticky lg:top-[78px] lg:self-start">
    <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
      Popular Posts
    </h2>
    <ul className="divide-y divide-[#E4E7EC] rounded-xl border border-[#E4E7EC] bg-white">
      {posts.length ? (
        posts.map((post) => (
          <li key={post.id}>
            <Link
              to={blogDetailPath(post.slug)}
              className="flex gap-3 p-4 transition-colors hover:bg-[#F9FAFB]"
            >
              <img src={post.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="line-clamp-2 text-[13px] font-bold leading-snug text-deep-blue">
                  {post.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#64748B]">{post.excerpt}</p>
                <p className="mt-2 text-[11px] text-[#98A2B3]">
                  {post.readTime} · {post.author}
                </p>
              </div>
            </Link>
          </li>
        ))
      ) : (
        <li className="p-4 text-[13px] text-[#64748B]">No other articles yet.</li>
      )}
    </ul>
  </aside>
);

export default PopularPosts;
