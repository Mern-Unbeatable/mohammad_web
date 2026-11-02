import SuspendUserModal from "@/components/modals/admin/SuspendUserModal";
import ProfilePageContent from "@/components/data-display/ProfilePageContent/ProfilePageContent";
import { ProfilePageSkeleton } from "@/components/loader";
import { SubscriptionDetailsCard } from "@/modules/dash/user/profile";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import { StartConversationModal } from "@/modules/messages";
import AccountDetailsCard from "../components/detail/AccountDetailsCard";
import ProfileActivityTabs from "../components/detail/ProfileActivityTabs";
import { useAdminUserDetail } from "../hooks/useAdminUserDetail";
import { USERS_PATH } from "../constant/constants";

const AdminUserDetailView = () => {
  const {
    status,
    errorMessage,
    selectedUser,
    profileUser,
    posts,
    content,
    account,
    message,
  } = useAdminUserDetail();

  if (status === "loading") {
    return (
      <PanelPage>
        <PanelBackButton fallback={USERS_PATH} className="py-1" />
        <ProfilePageSkeleton showSubscription sidebar />
      </PanelPage>
    );
  }

  if (status === "error") {
    return (
      <PanelPage>
        <PanelBackButton fallback={USERS_PATH} className="py-1" />
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-[16px] font-semibold text-deep-blue">
            {errorMessage}
          </p>
        </div>
      </PanelPage>
    );
  }

  return (
    <PanelPage>
      <PanelBackButton fallback={USERS_PATH} className="py-1" />
      <ProfilePageContent
        user={profileUser}
        posts={posts.items}
        postsLoading={posts.loading}
        hasMorePosts={posts.hasMore}
        loadingMorePosts={posts.loadingMore}
        onLoadMorePosts={posts.loadMore}
        showEdit={false}
        showMessage
        messageHref={message.href}
        onMessage={message.start}
        subscriptionSlot={
          <SubscriptionDetailsCard
            subscription={profileUser.subscription}
            manageable={false}
            accent
          />
        }
        sidebarSlot={
          <AccountDetailsCard
            user={selectedUser}
            updating={account.updating}
            onSuspend={account.openSuspend}
            onActivate={account.activate}
          />
        }
        renderActivity={(activity) => (
          <ProfileActivityTabs
            posts={activity}
            postsTotal={posts.total}
            content={content.data}
            contentLoading={content.loading}
            kinds={content.kinds}
          />
        )}
        postsTitle={null}
        threeColumn
      />

      <SuspendUserModal
        open={account.suspendOpen}
        userName={profileUser.name}
        onClose={account.closeSuspend}
        onConfirm={account.suspend}
      />

      <StartConversationModal
        open={message.open}
        title="New message"
        description={`Start a conversation with ${profileUser.name}.`}
        recipient={profileUser}
        onClose={message.close}
        onSend={message.send}
      />
    </PanelPage>
  );
};

export default AdminUserDetailView;
