import PanelPage from "@/components/layout/PanelPage";
import BlogsHub from "@/components/data-display/BlogHub/BlogsHub";
import { useBlogsHub } from "../hooks/useBlogsHub";
import { BLOG_BASE_PATH, BLOGS_PAGE_SIZE } from "../constant/constants";

const SupplierBlogsView = () => {
  const hub = useBlogsHub();

  return (
    <PanelPage layout="bleed">
      <BlogsHub hub={hub} basePath={BLOG_BASE_PATH} pageSize={BLOGS_PAGE_SIZE} />
    </PanelPage>
  );
};

export default SupplierBlogsView;
