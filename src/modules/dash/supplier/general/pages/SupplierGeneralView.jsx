import GeneralPostCard from "@/components/data-display/GeneralPostCard/GeneralPostCard";
import { CreateGeneralPostModal } from "@/modules/dash/user/general";
import PanelPage from "@/components/layout/PanelPage";
import SupplierGeneralToolbar from "../components/posts/SupplierGeneralToolbar";
import PostsGrid from "../components/posts/PostsGrid";
import { useGeneralPosts } from "../hooks/useGeneralPosts";
import { GENERAL_VIEW, generalPostPath } from "../constant/constants";

const SupplierGeneralView = () => {
  const general = useGeneralPosts();

  return (
    <PanelPage>
      <SupplierGeneralToolbar
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
        onPageChange={general.changePage}
      />

      <CreateGeneralPostModal
        open={general.modalOpen}
        onClose={general.closeModal}
        onSubmit={general.createPost}
        saving={general.saving}
      />
    </PanelPage>
  );
};

export default SupplierGeneralView;
