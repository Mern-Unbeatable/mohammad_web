import DashboardPage from "@/components/layout/DashboardPage";
import { ProfilePageSkeleton } from "@/components/loader";
import ProfilePageContent from "@/components/data-display/ProfilePageContent/ProfilePageContent";
import { CreatePostModal, ReportPostModal } from "@/modules/dash/user/feed";
import { usePostEditor } from "@/modules/dash/user/feed/hooks/usePostEditor";
import SubscriptionDetailsCard from "../components/subscription/SubscriptionDetailsCard";
import MyReportsCard from "../components/reports/MyReportsCard";
import MembershipPrompt from "../components/layout/MembershipPrompt";
import DeletePostModal from "@/components/modals/common/DeletePostModal";
import { DELETE_POST_DESCRIPTION } from "../constant/constants";
import { useProfilePage } from "../hooks/useProfilePage";
import { useMyPosts } from "../hooks/useMyPosts";

const ProfileView = () => {
  const profile = useProfilePage();
  const posts = useMyPosts();
  const editor = usePostEditor();
  const { profileUser } = profile;

  if (profile.loading && !profileUser) {
    return (
      <DashboardPage width="7xl">
        <ProfilePageSkeleton showSubscription sidebar />
      </DashboardPage>
    );
  }

  if (!profileUser) {
    return (
      <div className="py-10 text-center text-[14px] text-[#64748B]">
        Unable to load profile.
      </div>
    );
  }

  return (
    <>
      <DashboardPage width="7xl">
        <ProfilePageContent
          user={profileUser}
          posts={posts.posts}
          postsLoading={posts.loading}
          hasMorePosts={posts.hasMore}
          loadingMorePosts={posts.loadingMore}
          onLoadMorePosts={posts.loadMore}
          onReport={posts.openReport}
          onEdit={editor.openEditor}
          onDelete={posts.deleting ? undefined : posts.requestDelete}
          subscriptionSlot={
            profile.showSubscription ? (
              <SubscriptionDetailsCard subscription={profileUser.subscription} />
            ) : null
          }
          sidebarSlot={
            <MyReportsCard reports={profile.reports} loading={profile.reportsLoading} />
          }
          postsTitle="My Posts"
        />

        {!profileUser.isActive && <MembershipPrompt />}
      </DashboardPage>

      <ReportPostModal
        open={Boolean(posts.reportPost)}
        post={posts.reportPost}
        onClose={posts.closeReport}
      />

      {editor.editingPost ? (
        <CreatePostModal
          open
          mode="edit"
          post={editor.editingPost}
          onClose={editor.closeEditor}
          user={profileUser}
          submitting={editor.saving}
          onPublish={editor.saveEdit}
        />
      ) : null}

      <DeletePostModal
        open={Boolean(posts.pendingDelete)}
        description={DELETE_POST_DESCRIPTION}
        deleting={posts.deleting}
        onClose={posts.cancelDelete}
        onConfirm={posts.confirmDelete}
      />
    </>
  );
};

export default ProfileView;
