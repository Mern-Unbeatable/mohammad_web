import Skeleton from '@/components/loader/common/Skeleton';
import FeedPostCardSkeleton from '@/components/loader/skeletons/cards/FeedPostCardSkeleton';
import ProfileHeroSkeleton from '@/components/loader/skeletons/cards/ProfileHeroSkeleton';
import SubscriptionDetailsCardSkeleton from '@/components/loader/skeletons/cards/SubscriptionDetailsCardSkeleton';
import ContactInfoCardSkeleton from '@/components/loader/skeletons/cards/ContactInfoCardSkeleton';
import MyReportsCardSkeleton from '@/components/loader/skeletons/cards/MyReportsCardSkeleton';

/**
 * Full own-profile page skeleton — mirrors ProfilePageContent.
 */
const ProfilePageSkeleton = ({ showSubscription = true, sidebar = false }) =>
  sidebar ? (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <ProfileHeroSkeleton />
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
        <div className="contents lg:flex lg:flex-col lg:gap-4">
          {showSubscription && (
            <div className="order-1">
              <SubscriptionDetailsCardSkeleton />
            </div>
          )}
          <div className="order-4">
            <MyReportsCardSkeleton />
          </div>
        </div>
        <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
          <div className="order-2">
            <ContactInfoCardSkeleton showProfessional />
          </div>
          <section className="order-3">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="space-y-4">
              <FeedPostCardSkeleton />
              <FeedPostCardSkeleton />
            </div>
          </section>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <ProfileHeroSkeleton />
      {showSubscription ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <SubscriptionDetailsCardSkeleton />
          <ContactInfoCardSkeleton showProfessional />
        </div>
      ) : (
        <ContactInfoCardSkeleton showProfessional />
      )}
      <section>
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="space-y-4">
          <FeedPostCardSkeleton />
          <FeedPostCardSkeleton />
        </div>
      </section>
      <MyReportsCardSkeleton />
    </div>
  );

export default ProfilePageSkeleton;
