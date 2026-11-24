import Pagination from "@/components/common/Pagination/Pagination";
import { GeneralToolbar } from "@/modules/dash/user/general";
import PanelPage from "@/components/layout/PanelPage";
import PostsGrid from "../components/list/PostsGrid";
import DeletePostModal from "../components/list/DeletePostModal";
import ErrorBanner from "../components/common/ErrorBanner";
import { useAdminGeneral } from "../hooks/useAdminGeneral";

const AdminGeneralView = () => {
  const general = useAdminGeneral();

  return (
    <PanelPage>
      <GeneralToolbar
        category={general.category}
        onCategoryChange={general.changeCategory}
        activeView="browse"
        showBrowse={false}
        showMyPost={false}
        showCreatePost={false}
      />

      {general.error ? <ErrorBanner>{general.error}</ErrorBanner> : null}

      <PostsGrid
        items={general.items}
        loading={general.loading}
        deleting={general.deleting}
        onDelete={general.requestDelete}
      />

      <Pagination
        page={general.page}
        totalPages={general.totalPages}
        onPageChange={general.changePage}
        className="mt-2"
      />

      <DeletePostModal
        post={general.pendingDelete}
        deleting={general.deleting}
        onClose={general.cancelDelete}
        onConfirm={general.confirmDelete}
      />
    </PanelPage>
  );
};

export default AdminGeneralView;
