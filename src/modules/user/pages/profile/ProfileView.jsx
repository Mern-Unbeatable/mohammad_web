import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import { ProfilePageSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import ProfilePageContent from "@/components/data-display/ProfilePageContent/ProfilePageContent";
import ReportPostModal from "@/modules/user/components/feed/ReportPostModal";
import CreatePostModal from "@/modules/user/components/feed/CreatePostModal";
import { usePostEditor } from "@/modules/user/hooks/usePostEditor";
import {
  SubscriptionDetailsCard,
  MyReportsCard,
} from "@/modules/user/components/profile/ProfileSections";
import {
  fetchUserProfile,
  clearProfileError,
  toProfilePageUser,
} from "@/features/user/profile";
import {
  fetchMyPosts,
  fetchMoreMyPosts,
  removePost,
  toFeedPostModel,
} from "@/features/user/feed";
import {
  fetchMyReports,
  clearReportsError,
  toMyReportModel,
} from "@/features/user/reports";

const ProfileView = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading,
    error: profileError,
  } = useSelector((state) => state.userProfile);
  const {
    myPosts,
    myPostsMeta,
    myPostsLoaded,
    myPostsLoadingMore,
    myPostsStale,
    myPostsError,
    deleting,
  } = useSelector((state) => state.userFeed);
  const {
    reports,
    reportsLoading,
    error: reportsError,
  } = useSelector((state) => state.userReports);
  const [reportPost, setReportPost] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { editingPost, openEditor, closeEditor, saveEdit, saving } =
    usePostEditor();

  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const isPremium =
    profileUser?.isActive ||
    profileUser?.membershipStatus === "premium" ||
    profileUser?.membershipStatus === "trial" ||
    profileUser?.membershipStatus === "cancelled";
  const showSubscriptionCard =
    Boolean(profileUser?.subscription) &&
    ["premium", "trial", "cancelled"].includes(profileUser?.membershipStatus);

  const activity = useMemo(
    () => (myPosts || []).map(toFeedPostModel).filter(Boolean),
    [myPosts],
  );
  const hasMorePosts =
    (myPostsMeta?.page ?? 1) < (myPostsMeta?.totalPages ?? 1);

  const myReports = useMemo(
    () => (reports || []).map(toMyReportModel).filter(Boolean),
    [reports],
  );

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(clearReportsError());
    dispatch(fetchUserProfile());
    dispatch(fetchMyReports({ page: 1, pageSize: 10, sort: "desc" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch, myPostsStale]);

  useEffect(() => {
    if (myPostsError) toast.error(myPostsError);
  }, [myPostsError]);

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

  useEffect(() => {
    if (profileError) toast.error(profileError);
  }, [profileError]);

  useEffect(() => {
    if (reportsError) toast.error(reportsError);
  }, [reportsError]);

  if (loading && !profileUser) {
    return (
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-7xl">
          <ProfilePageSkeleton showSubscription sidebar />
        </Container>
      </main>
    );
  }

  if (!profileUser) {
    return (
      <main className="py-10 text-center text-[14px] text-[#64748B]">
        Unable to load profile.
      </main>
    );
  }

  return (
    <>
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-7xl">
          <ProfilePageContent
            user={profileUser}
            posts={activity}
            postsLoading={!myPostsLoaded && !myPostsError}
            hasMorePosts={hasMorePosts}
            loadingMorePosts={myPostsLoadingMore}
            onLoadMorePosts={() => dispatch(fetchMoreMyPosts())}
            onReport={setReportPost}
            onEdit={openEditor}
            onDelete={deleting ? undefined : setPendingDelete}
            isPremium={isPremium}
            subscriptionSlot={
              showSubscriptionCard ? (
                <SubscriptionDetailsCard
                  subscription={profileUser.subscription}
                />
              ) : null
            }
            sidebarSlot={
              <MyReportsCard reports={myReports} loading={reportsLoading} />
            }
            postsTitle="My Posts"
          />

          {!profileUser.isActive && (
            <p className="mt-6 text-center text-[13px] text-[#64748B]">
              Want full access?{" "}
              <Link
                to="/subscription"
                className="font-semibold text-primary hover:underline"
              >
                View membership plans
              </Link>
            </p>
          )}
        </Container>
      </main>

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />

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

export default ProfileView;
