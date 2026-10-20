import { useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import { GeneralToolbar } from '@/modules/dash/user/pages/general';
import CreateGeneralPostModal from '@/shared/pages/general/CreateGeneralPostModal';
import { filterGeneralPosts, generalPosts, getMyGeneralPosts } from '@/modules/dash/user/data/general';
import { GRID_PAGE_SIZE, usePaginatedList } from '@/shared/hooks/usePaginatedList';

const GeneralPageContent = ({
  basePath = '/general',
  activeView = 'browse',
  posts = generalPosts,
}) => {
  const [category, setCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [myPosts, setMyPosts] = useState(getMyGeneralPosts);

  const source = activeView === 'mine' ? myPosts : posts;

  const filtered = useMemo(
    () => filterGeneralPosts(source, category),
    [source, category]
  );

  const { page, setPage, totalPages, pageItems } = usePaginatedList(filtered, GRID_PAGE_SIZE, [
    category,
    activeView,
  ]);

  const detailBase = `${basePath}`;

  const handleDelete = (id) => {
    setMyPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <>
      <GeneralToolbar
        category={category}
        onCategoryChange={setCategory}
        activeView={activeView}
        onCreatePost={() => setModalOpen(true)}
        myPostHref={`${basePath}/my-posts`}
      />

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((post) => (
              <GeneralPostCard
                key={post.id}
                post={post}
                variant={activeView === 'mine' ? 'mine' : 'browse'}
                detailHref={`${detailBase}/${post.id}`}
                onEdit={() => {}}
                onDelete={activeView === 'mine' ? handleDelete : undefined}
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
          <p className="text-[15px] font-semibold text-deep-blue sm:text-[16px]">No posts yet</p>
          <p className="mt-2 text-[14px] text-[#64748B] sm:text-[15px]">
            Share industry news or documentation with the laboratory community.
          </p>
        </div>
      )}

      <CreateGeneralPostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default GeneralPageContent;
