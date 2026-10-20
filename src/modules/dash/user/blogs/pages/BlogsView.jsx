import BlogsHub from '@/components/data-display/BlogHub/BlogsHub';
import { useBlogsHub } from '../hooks/useBlogsHub';
import { BLOG_BASE_PATH, BLOGS_PAGE_SIZE } from '../constant/constants';

const BlogsView = () => {
  const hub = useBlogsHub();

  return <BlogsHub hub={hub} basePath={BLOG_BASE_PATH} pageSize={BLOGS_PAGE_SIZE} />;
};

export default BlogsView;
