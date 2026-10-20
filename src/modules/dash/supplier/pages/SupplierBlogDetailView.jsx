import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import { BlogDetailSkeleton } from "@/components/common/Skeleton";
import NotFound from "@/shared/pages/NotFound";
import {
  fetchSupplierBlogBySlug,
  fetchSupplierLatestBlogs,
  clearSelectedBlog,
  clearBlogsError,
  toBlogCardModel,
  toBlogDetailModel,
} from "@/features/dash/supplier/blogs";

const BLOG_BASE = "/supplier/blogs";

const SupplierBlogDetailView = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const {
    selectedBlog,
    selectedBlogLoading,
    latestBlogs,
    error,
  } = useSelector((state) => state.supplierBlogs);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return undefined;
    setNotFound(false);
    dispatch(clearBlogsError());
    dispatch(fetchSupplierBlogBySlug(slug)).then((result) => {
      if (fetchSupplierBlogBySlug.rejected.match(result)) {
        setNotFound(true);
      }
    });
    dispatch(fetchSupplierLatestBlogs({ pageSize: 5 }));
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (error && !selectedBlogLoading) toast.error(error);
  }, [error, selectedBlogLoading]);

  const detail = useMemo(
    () => toBlogDetailModel(selectedBlog),
    [selectedBlog],
  );

  const popularPosts = useMemo(
    () =>
      (latestBlogs || [])
        .map(toBlogCardModel)
        .filter((post) => post && post.slug !== slug)
        .slice(0, 5),
    [latestBlogs, slug],
  );

  if (notFound) return <NotFound />;

  if (selectedBlogLoading || (!detail && !error)) {
    return (
      <div className="-m-4 sm:-m-5 lg:-m-6">
        <div className="py-5 sm:py-8">
          <Container className="max-w-[960px]">
            <BlogDetailSkeleton />
          </Container>
        </div>
      </div>
    );
  }

  if (!detail) return <NotFound />;

  return (
    <div className="-m-4 sm:-m-5 lg:-m-6">
      <div className="py-5 sm:py-8">
        <Container className="max-w-[960px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:max-w-none">
            <article className="min-w-0">
              <Link
                to={BLOG_BASE}
                className="mb-4 inline-flex text-[13px] font-medium text-primary hover:underline sm:mb-5"
              >
                ← Back to Blogs
              </Link>

              <h1 className="text-[22px] font-bold leading-tight text-deep-blue sm:text-[28px] lg:text-[32px]">
                {detail.title}
              </h1>

              <p className="mt-3 flex flex-col gap-1 text-[12px] text-[#64748B] sm:flex-row sm:flex-wrap sm:gap-x-2 sm:text-[13px]">
                <span>By {detail.authorDisplay}</span>
                <span className="hidden sm:inline">|</span>
                <span>Published on {detail.publishedOn}</span>
                <span className="hidden sm:inline">|</span>
                <span>{detail.readTime}</span>
              </p>

              <img
                src={detail.image}
                alt=""
                className="mt-5 aspect-[16/9] w-full rounded-lg object-cover sm:mt-6 sm:rounded-xl"
              />

              <div className="mt-6 space-y-4 sm:mt-8">
                {detail.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[14px] leading-[1.75] text-[#475467] sm:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <aside className="min-w-0 lg:sticky lg:top-[78px] lg:self-start">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                Popular Posts
              </h2>
              <ul className="divide-y divide-[#E4E7EC] rounded-xl border border-[#E4E7EC] bg-white">
                {popularPosts.length ? (
                  popularPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`${BLOG_BASE}/${post.slug}`}
                        className="flex gap-3 p-4 transition-colors hover:bg-[#F9FAFB]"
                      >
                        <img
                          src={post.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-[13px] font-bold leading-snug text-deep-blue">
                            {post.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[12px] text-[#64748B]">
                            {post.excerpt}
                          </p>
                          <p className="mt-2 text-[11px] text-[#98A2B3]">
                            {post.readTime} · {post.author}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-[13px] text-[#64748B]">
                    No other articles yet.
                  </li>
                )}
              </ul>
            </aside>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SupplierBlogDetailView;
