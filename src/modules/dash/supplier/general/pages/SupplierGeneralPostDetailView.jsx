import PanelPage from "@/components/navigation/panel/PanelPage";
import { GeneralPostDetailSkeleton } from "@/components/loader";
import NotFound from "@/modules/error/NotFound";
import BackToGeneralLink from "../components/detail/BackToGeneralLink";
import GeneralPostHeader from "../components/detail/GeneralPostHeader";
import GeneralPostBody from "../components/detail/GeneralPostBody";
import PostActions from "../components/detail/PostActions";
import { useGeneralPostDetail } from "../hooks/useGeneralPostDetail";

const SupplierGeneralPostDetailView = () => {
  const { notFound, loading, post, share } = useGeneralPostDetail();

  if (notFound) return <NotFound />;

  if (loading) {
    return (
      <PanelPage>
        <GeneralPostDetailSkeleton />
      </PanelPage>
    );
  }

  if (!post) return <NotFound />;

  return (
    <PanelPage>
      <div className="py-5 sm:py-8">
        <BackToGeneralLink />
        <GeneralPostHeader post={post} />
        <GeneralPostBody body={post.body} summary={post.summary} />
        <PostActions post={post} onShare={share} />
      </div>
    </PanelPage>
  );
};

export default SupplierGeneralPostDetailView;
