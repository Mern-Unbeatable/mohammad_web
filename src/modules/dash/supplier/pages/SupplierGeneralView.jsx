import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination/Pagination";
import { CardSkeleton } from "@/components/common/Skeleton";
import GeneralPostCard from "@/components/data-display/GeneralPostCard/GeneralPostCard";
import { GeneralToolbar, CreateGeneralPostModal } from "@/modules/dash/user/pages/general";
import PanelPage from "@/layouts/panel/PanelPage";
import {
  fetchSupplierGeneralPosts,
  createSupplierGeneralPost,
  clearGeneralError,
  invalidateGeneralPostsList,
  categoryToApi,
  toGeneralPostModel,
  formToCreatePayload,
} from "@/features/dash/supplier/general";
import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const BASE = "/supplier/general";

const buildPostsQuery = ({ page, category, mine = false }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: "desc",
  };
  if (mine) params.mine = true;
  const type = categoryToApi(category);
  if (type) params.type = type;
  return params;
};

const SupplierGeneralView = () => {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, saving, error } = useSelector(
    (state) => state.supplierGeneral,
  );

  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    dispatch(clearGeneralError());
    dispatch(fetchSupplierGeneralPosts(buildPostsQuery({ page, category })));
  }, [dispatch, page, category]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (posts || []).map(toGeneralPostModel).filter(Boolean),
    [posts],
  );

  const totalPages = Math.max(1, postsMeta?.totalPages || 1);

  const handleCategoryChange = (next) => {
    if (next === category) return;
    dispatch(invalidateGeneralPostsList());
    setCategory(next);
    setPage(1);
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    dispatch(invalidateGeneralPostsList());
    setPage(next);
  };

  const handleCreate = async (form) => {
    const payload = formToCreatePayload(form);
    if (!payload.title) {
      toast.error("Title is required");
      return false;
    }
    if (payload.type === "DOCUMENT" && !payload.documentUrl) {
      toast.error("Document URL is required");
      return false;
    }

    const result = await dispatch(createSupplierGeneralPost(payload));
    if (createSupplierGeneralPost.fulfilled.match(result)) {
      toast.success("Post published");
      dispatch(invalidateGeneralPostsList());
      dispatch(
        fetchSupplierGeneralPosts(buildPostsQuery({ page: 1, category })),
      );
      setPage(1);
      return true;
    }
    toast.error(result.payload || "Failed to create post");
    return false;
  };

  return (
    <PanelPage>
      <GeneralToolbar
        category={category}
        onCategoryChange={handleCategoryChange}
        activeView="browse"
        onCreatePost={() => setModalOpen(true)}
        browseHref={BASE}
        myPostHref={`${BASE}/my-posts`}
      />

      {postsLoading ? (
        <CardSkeleton
          variant="generalPost"
          count={GRID_PAGE_SIZE}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />
      ) : pageItems.length ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((post) => (
              <GeneralPostCard
                key={post.id}
                post={post}
                variant="browse"
                detailHref={`${BASE}/${post.id}`}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </>
      ) : (
        <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
          <p className="text-[15px] font-semibold text-deep-blue sm:text-[16px]">
            No posts yet
          </p>
          <p className="mt-2 text-[14px] text-[#64748B] sm:text-[15px]">
            Share industry news or documentation with the laboratory community.
          </p>
        </div>
      )}

      <CreateGeneralPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        saving={saving}
      />
    </PanelPage>
  );
};

export default SupplierGeneralView;
