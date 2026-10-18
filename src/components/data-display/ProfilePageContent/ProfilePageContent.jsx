import ProfileHero, {
  ContactInfoCard,
  ProfessionalInfoCard,
} from "@/components/data-display/ProfileHero/ProfileHero";
import ActivitySection from "@/components/data-display/ActivitySection/ActivitySection";
import { currentUser } from "@/modules/user/data/dashboard";

/**
 * Composed own-profile page content: hero, info cards, and activity feed.
 *
 * When `sidebarSlot` is provided the page uses a two-column layout on large
 * screens: subscription + sidebar on the left, info cards + posts on the right.
 * On small screens it stacks as subscription → info → posts → sidebar.
 */
const ProfilePageContent = ({
  user = currentUser,
  posts = [],
  postsLoading = false,
  hasMorePosts = false,
  loadingMorePosts = false,
  onLoadMorePosts,
  onReport,
  onEdit,
  onDelete,
  isPremium = user.membershipStatus === "premium",
  editHref = "/profile/edit",
  showEdit = true,
  showMessage = false,
  messageHref = "/chat",
  subscriptionSlot = null,
  sidebarSlot = null,
  postsTitle = "Activity",
  threeColumn = false,
  mainSlot = null,
}) => {
  const hero = (
    <ProfileHero
      user={user}
      editHref={editHref}
      showEdit={showEdit}
      showMessage={showMessage}
      messageHref={messageHref}
    />
  );

  const activity = (
    <ActivitySection
      posts={posts}
      loading={postsLoading}
      hasMore={hasMorePosts}
      loadingMore={loadingMorePosts}
      onLoadMore={onLoadMorePosts}
      onReport={onReport}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyName={user.firstName || user.name}
      title={postsTitle}
      className={sidebarSlot ? "order-3" : ""}
    />
  );

  const infoCards = isPremium ? (
    <ContactInfoCard user={user} showProfessional narrow accent />
  ) : (
    <>
      <ProfessionalInfoCard user={user} extended />
      <ContactInfoCard user={user} narrow accent />
    </>
  );

  // 2xl: contact info | activity | account cards. xl: all cards left, activity
  // right so posts keep a feed-like width. Below xl the cards stack.
  if (threeColumn) {
    return (
      <div className="space-y-4">
        {hero}
        {mainSlot}

        <div className="flex flex-col gap-4 xl:grid xl:gap-x-12 xl:grid-cols-[minmax(320px,1fr)_minmax(0,688px)] xl:grid-rows-[auto_auto_1fr] xl:items-start 2xl:grid-cols-[minmax(280px,1fr)_minmax(0,688px)_minmax(300px,1fr)] 2xl:grid-rows-[auto_1fr]">
          <div className="order-1 space-y-4 xl:col-start-1 xl:row-start-1 2xl:row-span-2">
            {infoCards}
          </div>
          {subscriptionSlot ? (
            <div className="order-2 xl:col-start-1 xl:row-start-2 2xl:col-start-3 2xl:row-start-1">
              {subscriptionSlot}
            </div>
          ) : null}
          {sidebarSlot ? (
            <div className="order-4 xl:col-start-1 xl:row-start-3 2xl:col-start-3 2xl:row-start-2">
              {sidebarSlot}
            </div>
          ) : null}
          <div className="order-3 min-w-0 xl:col-start-2 xl:row-span-3 xl:row-start-1 2xl:row-span-2">
            {activity}
          </div>
        </div>
      </div>
    );
  }

  if (sidebarSlot) {
    return (
      <div className="space-y-4">
        {hero}

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
          <div className="contents lg:flex lg:flex-col lg:gap-4">
            {subscriptionSlot && (
              <div className="order-1">{subscriptionSlot}</div>
            )}
            <div className="order-4">{sidebarSlot}</div>
          </div>

          <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
            <div className="order-2 space-y-4">
              {isPremium ? (
                <ContactInfoCard user={user} showProfessional />
              ) : (
                <>
                  <ProfessionalInfoCard user={user} extended />
                  <ContactInfoCard user={user} />
                </>
              )}
            </div>
            {activity}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hero}

      {isPremium ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          {subscriptionSlot}
          <ContactInfoCard user={user} showProfessional />
        </div>
      ) : (
        <>
          <ProfessionalInfoCard user={user} extended />
          <ContactInfoCard user={user} />
        </>
      )}

      {activity}
    </div>
  );
};

export default ProfilePageContent;
