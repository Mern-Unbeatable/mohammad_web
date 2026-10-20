import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import { CardSkeleton } from "@/components/common/Skeleton";
import GeneralPostCard from "@/components/data-display/GeneralPostCard/GeneralPostCard";
import { GeneralToolbar } from "@/modules/dash/user/pages/general";
import PanelPage from "@/layouts/panel/PanelPage";
import {
  fetchGeneralPosts,
  removeGeneralPost,
} from "@/features/dash/admin/general";
import {
  categoryToApi,
  toGeneralPostModel,
} from "@/features/dash/admin/general/generalMappers";

const PAGE_SIZE = 8;

const buildPostsQuery = ({ page, category }) => {
  const params = {
    page,
    pageSize: PAGE_SIZE,
  };

  const type = categoryToApi(category);
  if (type) params.type = type;

  return params;
};

const AdminGeneralView = () => {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, deleting, error } = useSelector(
    (state) => state.adminGeneral,
  );

  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    dispatch(fetchGeneralPosts(buildPostsQuery({ page, category })));
  }, [dispatch, page, category]);

  const pageItems = useMemo(
    () => (posts || []).map(toGeneralPostModel).filter(Boolean),
    [posts],
  );

  const handleDeleteRequest = (postId) => {
    if (deleting) return;
    const post = pageItems.find((item) => item.id === postId);
    if (!post) return;
    setPendingDelete(post);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeGeneralPost(pendingDelete.id));
    if (removeGeneralPost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  return (
    <PanelPage>
      <GeneralToolbar
        category={category}
        onCategoryChange={setCategory}
        activeView="browse"
        showBrowse={false}
        showMyPost={false}
        showCreatePost={false}
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {postsLoading && !pageItems.length ? (
        <CardSkeleton
          variant="generalPost"
          count={8}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#64748B]">
          No general posts found for this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((post) => (
            <GeneralPostCard
              key={post.id}
              post={post}
              variant="admin"
              detailHref={`/admin/general/${post.id}`}
              onDelete={deleting ? undefined : handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <Pagination
        page={postsMeta?.page || page}
        totalPages={postsMeta?.totalPages || 1}
        onPageChange={setPage}
        className="mt-2"
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete post?"
        description={
          pendingDelete ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              This will permanently remove{" "}
              <span className="font-semibold text-deep-blue">
                {pendingDelete.title || "this post"}
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

export default AdminGeneralView;
