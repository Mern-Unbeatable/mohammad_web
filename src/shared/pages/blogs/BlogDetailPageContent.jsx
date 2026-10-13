import { Link, useParams } from 'react-router';
import Container from '@/components/ui/Container';
import { featuredArticle, getArticleBySlug, popularPosts } from '@/modules/user/data/blogs';
import NotFound from '@/shared/pages/NotFound';

const BlogDetailPageContent = ({ blogBasePath = '/blogs', slug: slugOverride }) => {
  const { slug: slugParam } = useParams();
  const slug = slugOverride ?? slugParam;
  const article = getArticleBySlug(slug);

  if (!article) return <NotFound />;

  const detail =
    slug === featuredArticle.slug
      ? featuredArticle
      : {
          ...article,
          authorDisplay: article.author,
          publishedOn: article.date,
          readTime: article.readTime,
          body: [
            article.excerpt,
            'Laboratory professionals face evolving regulatory expectations, tighter timelines and increasing pressure to maintain data integrity across every step of the analytical workflow.',
            'This article explores practical approaches used by leading QC and microbiology teams to stay audit-ready while continuing to deliver reliable results.',
            'Whether you are validating a new method, qualifying equipment or preparing for an inspection, structured documentation and proactive maintenance remain the foundation of compliance.',
            'Share your experience with peers on Lab Unity to help the wider laboratory community learn from real-world challenges and solutions.',
          ],
        };

  return (
    <div className="py-5 sm:py-8">
      <Container className="max-w-[960px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:max-w-none">
          <article className="min-w-0">
            <Link
              to={blogBasePath}
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
                <p key={paragraph} className="text-[14px] leading-[1.75] text-[#475467] sm:text-[15px]">
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
              {popularPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`${blogBasePath}/${post.slug}`}
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
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default BlogDetailPageContent;
