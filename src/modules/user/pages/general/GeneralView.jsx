import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '@/components/common/Pagination/Pagination';
import { CardSkeleton } from '@/components/common/Skeleton';
import Container from '@/components/ui/Container';
import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import GeneralToolbar from '@/modules/user/components/general/GeneralToolbar';
import CreateGeneralPostModal from '@/shared/pages/general/CreateGeneralPostModal';
import {
  fetchGeneralPosts,
  createGeneralPost,
  clearGeneralError,
  categoryToApi,
  toGeneralPostModel,
  formToCreatePayload,
} from '@/features/user/general';
import { GRID_PAGE_SIZE } from '@/shared/hooks/usePaginatedList';

const BASE = '/general';

const buildPostsQuery = ({ page, category, mine = false }) => {
  const params = {
    page,
    pageSize: GRID_PAGE_SIZE,
    sort: 'desc',
  };
  if (mine) params.mine = true;
  const type = categoryToApi(category);
  if (type) params.type = type;
  return params;
};

const GeneralView = () => {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, saving, error } = useSelector(
    (state) => state.userGeneral,
  );

  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    dispatch(clearGeneralError());
    dispatch(fetchGeneralPosts(buildPostsQuery({ page, category })));
  }, [dispatch, page, category]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const pageItems = useMemo(
    () => (posts || []).map(toGeneralPostModel).filter(Boolean),
    [posts],
  );

  const totalPages = Math.max(1, postsMeta?.totalPages || 1);

  const handleCreate = async (form) => {
    const payload = formToCreatePayload(form);
    if (!payload.title) {
      toast.error('Title is required');
      return false;
    }
    if (payload.type === 'DOCUMENT' && !payload.documentUrl) {
      toast.error('Document URL is required');
      return false;
    }

    const result = await dispatch(createGeneralPost(payload));
    if (createGeneralPost.fulfilled.match(result)) {
      toast.success('Post published');
      dispatch(fetchGeneralPosts(buildPostsQuery({ page: 1, category })));
      setPage(1);
      return true;
    }
    toast.error(result.payload || 'Failed to create post');
    return false;
  };

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <GeneralToolbar
          category={category}
          onCategoryChange={setCategory}
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
              onPageChange={setPage}
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
      </Container>
    </main>
  );
};

export default GeneralView;
