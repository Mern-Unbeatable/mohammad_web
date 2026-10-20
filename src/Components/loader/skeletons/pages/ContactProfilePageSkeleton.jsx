import Skeleton from '@/components/loader/common/Skeleton';
import FeedPostCardSkeleton from '@/components/loader/skeletons/cards/FeedPostCardSkeleton';
import ProfileHeroSkeleton from '@/components/loader/skeletons/cards/ProfileHeroSkeleton';
import ContactInfoCardSkeleton from '@/components/loader/skeletons/cards/ContactInfoCardSkeleton';
import ProfessionalInfoCardSkeleton from '@/components/loader/skeletons/cards/ProfessionalInfoCardSkeleton';

/**
 * Contact profile page skeleton (hero + professional + contact + activity).
 */
const ContactProfilePageSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <ProfileHeroSkeleton />
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
      <div className="order-2 min-w-0 lg:order-none">
        <ContactInfoCardSkeleton />
      </div>
      <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
        <div className="order-1 lg:order-none">
          <ProfessionalInfoCardSkeleton />
        </div>
        <section className="order-3 min-w-0 lg:order-none">
          <Skeleton className="mb-4 h-5 w-24" />
          <div className="space-y-4">
            <FeedPostCardSkeleton />
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default ContactProfilePageSkeleton;
