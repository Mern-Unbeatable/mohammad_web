import { BlogDetailSkeleton } from '@/components/common/Skeleton';
import NotFound from '@/shared/pages/NotFound';
import BlogDetailPage from './components/layout/BlogDetailPage';
import BlogArticle from './components/detail/BlogArticle';
import PopularPosts from './components/detail/PopularPosts';
import { useBlogDetail } from './hooks/useBlogDetail';

const BlogDetailView = () => {
  const { notFound, loading, detail, popularPosts } = useBlogDetail();

  if (notFound) return <NotFound />;

  if (loading) {
    return (
      <BlogDetailPage>
        <div className="xl:max-w-none">
          <BlogDetailSkeleton />
        </div>
      </BlogDetailPage>
    );
  }

  if (!detail) return <NotFound />;

  return (
    <BlogDetailPage>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:max-w-none">
        <BlogArticle detail={detail} />
        <PopularPosts posts={popularPosts} />
      </div>
    </BlogDetailPage>
  );
};

export default BlogDetailView;
