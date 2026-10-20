import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { CardSkeleton } from "@/components/loader";
import BlogAdminCard from "@/components/data-display/BlogAdminCard/BlogAdminCard";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import { panelPrimaryBtn } from "@/components/navigation/panel/panelPageTheme";
import {
  fetchBlogsList,
  removeBlogPost,
} from "@/features/dash/admin/blogs";
import { toBlogCardModel } from "@/features/dash/admin/blogs/blogsMappers";

const PAGE_SIZE = 8;

const AdminBlogsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, blogsMeta, blogsLoading, deleting, error } = useSelector(
    (state) => state.adminBlogs,
  );

  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(
      fetchBlogsList({
        page,
        pageSize: PAGE_SIZE,
      }),
    );
  }, [dispatch, page]);

  const pageItems = useMemo(
    () => (blogs || []).map(toBlogCardModel).filter(Boolean),
    [blogs],
  );

  const handleDeleteRequest = (blogId) => {
    if (deleting) return;
    const article = pageItems.find((item) => item.id === blogId);
    if (!article) return;
    setPendingDelete(article);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeBlogPost(pendingDelete.id));
    if (removeBlogPost.fulfilled.match(result)) {
      toast.success("Blog deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete blog");
  };

  return (
    <PanelPage>
      <PanelPageHeader
        title="Blogs"
        subtitle="Manage all blog posts from one place."
        action={
          <Link
            to="/admin/blogs/new"
            className={`${panelPrimaryBtn} w-full sm:w-auto`}
          >
            New Blog
          </Link>
        }
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {blogsLoading && !pageItems.length ? (
        <CardSkeleton
          variant="generalPost"
          count={8}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#64748B]">
          No blog posts yet. Create your first article.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((article) => (
            <BlogAdminCard
              key={article.id}
              article={article}
              onEdit={(id) => {
                const item = pageItems.find((entry) => entry.id === id);
                navigate("/admin/blogs/new", { state: { article: item } });
              }}
              onDelete={deleting ? undefined : handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <Pagination
        page={blogsMeta?.page || page}
        totalPages={blogsMeta?.totalPages || 1}
        onPageChange={setPage}
        className="mt-2"
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete blog post?"
        description={
          pendingDelete ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              This will permanently remove{" "}
              <span className="font-semibold text-deep-blue">
                {pendingDelete.title || "this blog"}
              </span>
              . This action cannot be undone.
            </p>
          ) : null
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </PanelPage>
  );
};

export default AdminBlogsView;
