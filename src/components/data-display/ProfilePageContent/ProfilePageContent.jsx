import ProfileHero, {
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection';
import { currentUser } from '@/modules/user/data/dashboard';

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
  onReport,
  onDelete,
  isPremium = user.membershipStatus === 'premium',
  editHref = '/profile/edit',
  showEdit = true,
  showMessage = false,
  messageHref = '/chat',
  subscriptionSlot = null,
  sidebarSlot = null,
  postsTitle = 'Activity',
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
      onReport={onReport}
      onDelete={onDelete}
      emptyName={user.firstName || user.name}
      title={postsTitle}
      className={sidebarSlot ? 'order-3' : ''}
    />
  );

  if (sidebarSlot) {
    return (
      <div className="space-y-4">
        {hero}

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
          <div className="contents lg:flex lg:flex-col lg:gap-4">
            {subscriptionSlot && <div className="order-1">{subscriptionSlot}</div>}
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
