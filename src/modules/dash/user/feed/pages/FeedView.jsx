import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import DashboardPage from "@/components/layout/DashboardPage";
import ConfirmModal from "@/components/modals/common/ConfirmModal";
import { LeftSidebar, RightSidebar } from "@/components/navigation";
import { usePostEditor } from "../hooks/usePostEditor";
import { toProfilePageUser } from "@/features/dash/user/profile";
import CreatePostModal from "@/components/modals/feed/CreatePostModal";
import FeedComposer from "../components/composer/FeedComposer";
import FeedFilters from "../components/composer/FeedFilters";
import FeedPostList from "../components/FeedPostList";
import ReportPostModal from "@/components/modals/feed/ReportPostModal";
import { DEFAULT_FEED_FILTER, FEED_FILTERS } from "../constants";
import { useCreatePost } from "../hooks/useCreatePost";
import { useFeedPosts } from "../hooks/useFeedPosts";
import { usePostDeletion } from "../hooks/usePostDeletion";
import { AdvertisementDistributionProvider, useAdvertisementDistribution } from "../context/AdvertisementDistributionContext";

const FeedView = () => {
  const { user } = useSelector((state) => state.userProfile);
  const saving = useSelector((state) => state.userFeed.saving);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);

  const [activeFilter, setActiveFilter] = useState(DEFAULT_FEED_FILTER);
  const [reportPost, setReportPost] = useState(null);

  const feed = useFeedPosts(activeFilter);
  const create = useCreatePost({ onPublished: feed.refresh });
  const deletion = usePostDeletion();
  const { editingPost, openEditor, closeEditor, saveEdit } = usePostEditor();

  return (
    <AdvertisementDistributionProvider>
      <FeedViewContent
        user={profileUser}
        saving={saving}
        feed={feed}
        create={create}
        deletion={deletion}
        editingPost={editingPost}
        activeFilter={activeFilter}
        reportPost={reportPost}
        openEditor={openEditor}
        closeEditor={closeEditor}
        saveEdit={saveEdit}
        setActiveFilter={setActiveFilter}
        setReportPost={setReportPost}
      />
    </AdvertisementDistributionProvider>
  );
};

/**
 * Inner component that uses the advertisement distribution context.
 * This is separated so it can access useAdvertisementDistribution.
 */
const FeedViewContent = ({
  user,
  saving,
  feed,
  create,
  deletion,
  editingPost,
  activeFilter,
  reportPost,
  openEditor,
  closeEditor,
  saveEdit,
  setActiveFilter,
  setReportPost,
}) => {
  const { feedAds, trackImpression, trackClick } = useAdvertisementDistribution();

  // Create wrapper tracking functions for feed ads
  const handleTrackAdImpression = (adId) => {
    trackImpression(adId);
  };

  const handleTrackAdClick = (adId) => {
    trackClick(adId);
  };

  return (
    <>
      <DashboardPage spacing="compact" className="flex gap-8">
        <LeftSidebar />

        <section className="min-w-0 w-full flex-1 space-y-4">
          <div className="hidden sm:block">
            <FeedComposer user={user} onCreatePost={create.openCreatePost} />
          </div>
          <FeedFilters
            filters={FEED_FILTERS}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
          <FeedPostList
            posts={feed.posts}
            feedAds={feedAds}
            loading={feed.loading}
            failed={feed.failed}
            hasMore={feed.hasMore}
            loadingMore={feed.loadingMore}
            onRetry={feed.reload}
            onLoadMore={feed.loadMore}
            onReport={setReportPost}
            onEdit={openEditor}
            onDelete={deletion.requestDelete}
            onTrackAdImpression={handleTrackAdImpression}
            onTrackAdClick={handleTrackAdClick}
          />
        </section>

        <RightSidebar />
      </DashboardPage>

      {create.open ? (
        <CreatePostModal
          open
          onClose={create.closeCreatePost}
          user={user}
          submitting={saving}
          onPublish={create.publish}
          initialOption={create.option}
        />
      ) : null}
      {editingPost ? (
        <CreatePostModal
          open
          mode="edit"
          post={editingPost}
          onClose={closeEditor}
          user={user}
          submitting={saving}
          onPublish={saveEdit}
        />
      ) : null}
      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
      <ConfirmModal
        open={Boolean(deletion.pendingDelete)}
        title="Delete post?"
        description="This will permanently remove this post, including its comments and reactions. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={deletion.confirmDelete}
      />
    </>
  );
};

export default FeedView;
