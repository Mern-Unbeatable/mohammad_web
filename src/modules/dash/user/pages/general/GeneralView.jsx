import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import CreateGeneralPostModal from '@/components/modals/general/CreateGeneralPostModal';
import GeneralPage from './components/layout/GeneralPage';
import GeneralToolbar from './components/toolbar/GeneralToolbar';
import PostsGrid from './components/posts/PostsGrid';
import { useGeneralPosts } from './hooks/useGeneralPosts';
import { GENERAL_VIEW, generalPostPath } from './constant/constants';

const GeneralView = () => {
  const general = useGeneralPosts();

  return (
    <GeneralPage>
      <GeneralToolbar
        category={general.category}
        onCategoryChange={general.changeCategory}
        activeView={GENERAL_VIEW.BROWSE}
        onCreatePost={general.openModal}
      />

      <PostsGrid
        loading={general.loading}
        items={general.items}
        renderCard={(post) => (
          <GeneralPostCard
            key={post.id}
            post={post}
            variant="browse"
            detailHref={generalPostPath(post.id)}
          />
        )}
        page={general.page}
        totalPages={general.totalPages}
        onPageChange={general.setPage}
      />

      <CreateGeneralPostModal
        open={general.modalOpen}
        onClose={general.closeModal}
        onSubmit={general.createPost}
        saving={general.saving}
      />
    </GeneralPage>
  );
};

export default GeneralView;
