import { BlogDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import BlogDetail, { BlogDetailFrame } from "@/components/data-display/BlogHub/BlogDetail";
import NotFound from "@/modules/error/NotFound";
import { useBlogDetail } from "../hooks/useBlogDetail";
import { BLOG_BASE_PATH } from "../constant/constants";

const SupplierBlogDetailView = () => {
  const { notFound, loading, detail, popularPosts } = useBlogDetail();

  if (notFound) return <NotFound />;

  if (loading) {
    return (
      <PanelPage layout="bleed">
        <BlogDetailFrame>
          <BlogDetailSkeleton />
        </BlogDetailFrame>
      </PanelPage>
    );
  }

  if (!detail) return <NotFound />;

  return (
    <PanelPage layout="bleed">
      <BlogDetail detail={detail} popularPosts={popularPosts} basePath={BLOG_BASE_PATH} />
    </PanelPage>
  );
};

export default SupplierBlogDetailView;
