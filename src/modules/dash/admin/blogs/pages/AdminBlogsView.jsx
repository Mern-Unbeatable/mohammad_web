import { Link } from "react-router";
import Pagination from "@/components/common/Pagination/Pagination";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import { panelPrimaryBtn } from "@/components/layout/panelPageTheme";
import BlogsGrid from "../components/list/BlogsGrid";
import DeleteBlogModal from "../components/list/DeleteBlogModal";
import ErrorBanner from "../components/common/ErrorBanner";
import { useAdminBlogs } from "../hooks/useAdminBlogs";
import { NEW_BLOG_PATH } from "../constant/constants";

const AdminBlogsView = () => {
  const blogs = useAdminBlogs();

  return (
    <PanelPage>
      <PanelPageHeader
        title="Blogs"
        subtitle="Manage all blog posts from one place."
        action={
          <Link to={NEW_BLOG_PATH} className={`${panelPrimaryBtn} w-full sm:w-auto`}>
            New Blog
          </Link>
        }
      />

      {blogs.error ? <ErrorBanner>{blogs.error}</ErrorBanner> : null}

      <BlogsGrid
        items={blogs.items}
        loading={blogs.loading}
        deleting={blogs.deleting}
        onEdit={blogs.editBlog}
        onDelete={blogs.requestDelete}
      />

      <Pagination
        page={blogs.page}
        totalPages={blogs.totalPages}
        onPageChange={blogs.changePage}
        className="mt-2"
      />

      <DeleteBlogModal
        article={blogs.pendingDelete}
        deleting={blogs.deleting}
        onClose={blogs.cancelDelete}
        onConfirm={blogs.confirmDelete}
      />
    </PanelPage>
  );
};

export default AdminBlogsView;
