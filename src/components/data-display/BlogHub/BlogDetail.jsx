import Container from '@/components/ui/Container';
import BlogArticle from './BlogArticle';
import PopularPosts from './PopularPosts';

/** Narrow article frame shared by the detail page and its loading state. */
export const BlogDetailFrame = ({ children }) => (
  <div className="py-5 sm:py-8">
    <Container className="max-w-[960px]">{children}</Container>
  </div>
);

/** Article with the "Popular Posts" rail beside it from `lg` up. */
const BlogDetail = ({ detail, popularPosts, basePath }) => (
  <BlogDetailFrame>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:max-w-none">
      <BlogArticle detail={detail} basePath={basePath} />
      <PopularPosts posts={popularPosts} basePath={basePath} />
    </div>
  </BlogDetailFrame>
);

export default BlogDetail;
