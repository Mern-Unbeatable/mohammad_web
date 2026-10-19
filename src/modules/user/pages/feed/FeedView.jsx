import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "@/components/ui/Container";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import LeftSidebar from "@/modules/user/components/shell/LeftSidebar";
import RightSidebar from "@/modules/user/components/shell/RightSidebar";
import { usePostEditor } from "@/modules/user/hooks/usePostEditor";
import { fetchUserProfile, toProfilePageUser } from "@/features/user/profile";
import CreatePostModal from "./components/composer/CreatePostModal";
import FeedComposer from "./components/composer/FeedComposer";
import FeedFilters from "./components/composer/FeedFilters";
import FeedPostList from "./components/FeedPostList";
import ReportPostModal from "./components/modals/ReportPostModal";
import { DEFAULT_FEED_FILTER, FEED_FILTERS } from "./constants";
import { useCreatePost } from "./hooks/useCreatePost";
import { useFeedPosts } from "./hooks/useFeedPosts";
import { usePostDeletion } from "./hooks/usePostDeletion";

const FeedView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userProfile);
  const saving = useSelector((state) => state.userFeed.saving);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);

  const [activeFilter, setActiveFilter] = useState(DEFAULT_FEED_FILTER);
  const [reportPost, setReportPost] = useState(null);

  const feed = useFeedPosts(activeFilter);
  const create = useCreatePost({ onPublished: feed.refresh });
  const deletion = usePostDeletion();
  const { editingPost, openEditor, closeEditor, saveEdit } = usePostEditor();

  useEffect(() => {
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  return (
    <>
      <main className="py-4 sm:py-5">
        <Container className="flex gap-8">
          <LeftSidebar />

          <section className="min-w-0 w-full flex-1 space-y-4">
            <div className="hidden sm:block">
              <FeedComposer user={profileUser} onCreatePost={create.openCreatePost} />
            </div>
            <FeedFilters
              filters={FEED_FILTERS}
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
            <FeedPostList
              posts={feed.posts}
              loading={feed.loading}
              failed={feed.failed}
              hasMore={feed.hasMore}
              loadingMore={feed.loadingMore}
              onRetry={feed.reload}
              onLoadMore={feed.loadMore}
              onReport={setReportPost}
              onEdit={openEditor}
              onDelete={deletion.requestDelete}
            />
          </section>

          <RightSidebar />
        </Container>
      </main>

      {create.open ? (
        <CreatePostModal
          open
          onClose={create.closeCreatePost}
          user={profileUser}
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
          user={profileUser}
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
