import { GeneralPostDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import NotFound from "@/modules/error/NotFound";
import PostHeader from "../components/detail/PostHeader";
import PostBody from "../components/detail/PostBody";
import PostActions from "../components/detail/PostActions";
import { useAdminGeneralPost } from "../hooks/useAdminGeneralPost";
import { postDownloadUrl } from "../utils/generalPosts";
import { GENERAL_PATH } from "../constant/constants";

const AdminGeneralPostDetailView = () => {
  const { loading, notFound, post } = useAdminGeneralPost();

  if (loading) {
    return (
      <PanelPage>
        <GeneralPostDetailSkeleton />
      </PanelPage>
    );
  }

  if (notFound) return <NotFound />;

  return (
    <PanelPage>
      <PanelBackButton fallback={GENERAL_PATH} />
      <PostHeader post={post} />
      <PostBody paragraphs={post.body} />
      <PostActions downloadUrl={postDownloadUrl(post)} />
    </PanelPage>
  );
};

export default AdminGeneralPostDetailView;
