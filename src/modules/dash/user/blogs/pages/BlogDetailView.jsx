import { BlogDetailSkeleton } from '@/components/loader';
import BlogDetail, { BlogDetailFrame } from '@/components/data-display/BlogHub/BlogDetail';
import NotFound from '@/modules/error/NotFound';
import { useBlogDetail } from '../hooks/useBlogDetail';
import { BLOG_BASE_PATH } from '../constant/constants';

const BlogDetailView = () => {
  const { notFound, loading, detail, popularPosts } = useBlogDetail();

  if (notFound) return <NotFound />;

  if (loading) {
    return (
      <BlogDetailFrame>
        <BlogDetailSkeleton />
      </BlogDetailFrame>
    );
  }

  if (!detail) return <NotFound />;

  return <BlogDetail detail={detail} popularPosts={popularPosts} basePath={BLOG_BASE_PATH} />;
};

export default BlogDetailView;
