import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import { CardSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import LeftSidebar from "@/modules/user/components/shell/LeftSidebar";
import RightSidebar from "@/modules/user/components/shell/RightSidebar";
import FeedPost from "@/modules/user/components/feed/FeedPost";
import CreatePostModal from "@/modules/user/components/feed/CreatePostModal";
import { DEFAULT_POST_OPTION } from "@/modules/user/components/feed/postTypeOptions";
import ReportPostModal from "@/modules/user/components/feed/ReportPostModal";
import LoadMorePosts from "@/modules/user/components/feed/LoadMorePosts";
import {
  FeedComposer,
  FeedFilters,
} from "@/modules/user/components/feed/FeedShared";
import { useFeedActions } from "@/modules/user/context/FeedActionsContext";
import { usePostEditor } from "@/modules/user/hooks/usePostEditor";
import {
  fetchFeed,
  fetchMoreFeed,
  createPost,
  removePost,
  invalidateFeedPosts,
  toFeedPostModel,
} from "@/features/user/feed";
import { fetchUserProfile, toProfilePageUser } from "@/features/user/profile";

const feedFilters = [
  { id: "all", label: "All" },
  { id: "questions", label: "Questions" },
  { id: "information", label: "Information" },
  { id: "suppliers", label: "Suppliers" },
];

const FEED_PAGE_SIZE = 20;

const filterToApiType = {
  questions: "question",
  information: "information",
  suppliers: "suppliers",
};

const FeedView = () => {
  const dispatch = useDispatch();
  const { registerOpenCreatePost } = useFeedActions();
  const {
    posts,
    postsMeta,
    postsLoading,
    postsLoadingMore,
    postsError,
    saving,
    deleting,
    error,
  } = useSelector((state) => state.userFeed);
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [createPostOption, setCreatePostOption] = useState(DEFAULT_POST_OPTION);
  const [reportPost, setReportPost] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { editingPost, openEditor, closeEditor, saveEdit } = usePostEditor();

  const openCreatePost = useCallback((option = DEFAULT_POST_OPTION) => {
    setCreatePostOption(option);
    setCreateOpen(true);
  }, []);

  useEffect(() => {
    registerOpenCreatePost(() => openCreatePost());
  }, [registerOpenCreatePost, openCreatePost]);

  useEffect(() => {
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  const feedQuery = useMemo(() => {
    const type = filterToApiType[activeFilter];
    return { page: 1, pageSize: FEED_PAGE_SIZE, sort: "desc", ...(type ? { type } : {}) };
  }, [activeFilter]);

  const loadFeed = useCallback(() => {
    dispatch(invalidateFeedPosts());
    dispatch(fetchFeed(feedQuery));
  }, [dispatch, feedQuery]);

  const hasMorePosts = (postsMeta?.page ?? 1) < (postsMeta?.totalPages ?? 1);
  const loadMorePosts = () =>
    dispatch(fetchMoreFeed({ ...feedQuery, page: (postsMeta?.page ?? 1) + 1 }));

  useLayoutEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const mappedPosts = useMemo(
    () => (posts || []).map(toFeedPostModel).filter(Boolean),
    [posts],
  );

  const handlePublish = async ({ type, content, imageUrls, documentUrl }) => {
    const apiType =
      type === "question"
        ? "QUESTION"
        : type === "suppliers"
          ? "SUPPLIERS"
          : "INFORMATION";

    const payload = {
      type: apiType,
      content: (content || "").trim(),
    };
    if (imageUrls?.length) payload.imageUrls = imageUrls;
    if (documentUrl) payload.documentUrl = documentUrl;

    const result = await dispatch(createPost(payload));
    if (createPost.fulfilled.match(result)) {
      toast.success("Post published");
      setCreateOpen(false);
      dispatch(fetchFeed(feedQuery));
    } else {
      toast.error(result.payload || "Failed to publish post");
    }
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removePost(pendingDelete.id));
    if (removePost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  return (
    <>
      <main className="py-4 sm:py-5">
        <Container className="flex gap-8">
          <LeftSidebar />

          <section className="min-w-0 w-full flex-1 space-y-4">
            <div className="hidden sm:block">
              <FeedComposer user={profileUser} onCreatePost={openCreatePost} />
            </div>
            <FeedFilters
              filters={feedFilters}
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />

            {postsLoading && mappedPosts.length === 0 ? (
              <CardSkeleton
                variant="feedPost"
                count={3}
                className="space-y-4"
              />
            ) : postsError && mappedPosts.length === 0 ? (
              <div className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-10 text-center text-[14px] text-[#64748B]">
                <p>Couldn&apos;t load posts.</p>
                <button
                  type="button"
                  onClick={loadFeed}
                  className="mt-2 font-semibold text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : mappedPosts.length === 0 ? (
              <p className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-10 text-center text-[14px] text-[#64748B]">
                No posts yet. Be the first to share something with the
                community.
              </p>
            ) : (
              <div className="space-y-4">
                {mappedPosts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    onReport={setReportPost}
                    onEdit={openEditor}
                    onDelete={deleting ? undefined : setPendingDelete}
                  />
                ))}
                {hasMorePosts ? (
                  <LoadMorePosts
                    onClick={loadMorePosts}
                    loading={postsLoadingMore}
                  />
                ) : null}
              </div>
            )}
          </section>

          <RightSidebar />
        </Container>
      </main>

      {createOpen ? (
        <CreatePostModal
          open
          onClose={() => setCreateOpen(false)}
          user={profileUser}
          submitting={saving}
          onPublish={handlePublish}
          initialOption={createPostOption}
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
        open={Boolean(pendingDelete)}
        title="Delete post?"
        description="This will permanently remove this post, including its comments and reactions. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default FeedView;
