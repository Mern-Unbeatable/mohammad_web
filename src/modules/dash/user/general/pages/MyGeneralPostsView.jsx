import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import CreateGeneralPostModal from '@/components/modals/general/CreateGeneralPostModal';
import GeneralPage from '../components/layout/GeneralPage';
import GeneralToolbar from '../components/toolbar/GeneralToolbar';
import PostsGrid from '../components/posts/PostsGrid';
import DeletePostModal from '@/components/modals/common/DeletePostModal';
import { useMyGeneralPosts } from '../hooks/useMyGeneralPosts';
import { GENERAL_VIEW, generalPostPath } from '../constant/constants';

const MyGeneralPostsView = () => {
  const mine = useMyGeneralPosts();

  return (
    <GeneralPage>
      <GeneralToolbar
        category={mine.category}
        onCategoryChange={mine.changeCategory}
        activeView={GENERAL_VIEW.MINE}
        onCreatePost={mine.openCreate}
      />

      <PostsGrid
        loading={mine.loading}
        items={mine.items}
        renderCard={(post) => (
          <GeneralPostCard
            key={post.id}
            post={post}
            variant="mine"
            detailHref={generalPostPath(post.id)}
            onEdit={mine.openEdit}
            onDelete={mine.deleting ? undefined : mine.requestDelete}
          />
        )}
        page={mine.page}
        totalPages={mine.totalPages}
        onPageChange={mine.changePage}
      />

      <CreateGeneralPostModal
        open={mine.modalOpen}
        onClose={mine.closeModal}
        onSubmit={mine.submitPost}
        saving={mine.saving}
        mode={mine.modalMode}
        initialValues={mine.modalInitialValues}
      />

      <DeletePostModal
        post={mine.pendingDelete}
        deleting={mine.deleting}
        onClose={mine.cancelDelete}
        onConfirm={mine.confirmDelete}
      />
    </GeneralPage>
  );
};

export default MyGeneralPostsView;
