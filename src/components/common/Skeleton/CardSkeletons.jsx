import { createElement } from 'react';
import Card from '@/components/ui/Card';
import Skeleton from './Skeleton';

/** Matches ContactCard layout (Avatar size="lg" = h-14) */
export const ContactCardSkeleton = () => (
  <Card className="flex flex-col text-center">
    <Skeleton className="h-16 w-full" rounded="none" />
    <div className="flex flex-col items-center px-5 pb-5">
      <Skeleton
        className="-mt-10 h-20 w-20 border-4 border-white"
        rounded="full"
      />
      <Skeleton className="mt-3 h-4 w-28" />
      <Skeleton className="mt-2 h-3 w-36" />
      <Skeleton className="mt-1.5 h-3.5 w-24" />
      <Skeleton className="mt-1 h-3 w-20" />
      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full" rounded="md" />
        <Skeleton className="h-9 w-full" rounded="md" />
      </div>
    </div>
  </Card>
);

/** Matches ListingCard layout */
export const ListingCardSkeleton = () => (
  <Card className="flex h-full flex-col">
    <Skeleton className="aspect-[4/3] w-full" rounded="none" />
    <div className="flex flex-1 flex-col p-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-20" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  </Card>
);

/** Matches JobCard layout; `mine` adds the status badge and owner actions. */
export const JobCardSkeleton = ({ mine = false }) => (
  <Card className="p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        {mine ? null : <Skeleton className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" rounded="xl" />}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-1/2 max-w-xs" />
          <div className="mt-3 flex flex-wrap gap-2">
            {mine ? <Skeleton className="h-5 w-14" rounded="full" /> : null}
            <Skeleton className="h-5 w-16" rounded="full" />
            <Skeleton className="h-5 w-14" rounded="full" />
            <Skeleton className="h-5 w-20" rounded="full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      {mine ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-[104px]" />
          <Skeleton className="h-9 w-[78px]" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      ) : (
        <Skeleton className="h-9 w-28 shrink-0" />
      )}
    </div>
  </Card>
);

export const MyJobCardSkeleton = () => <JobCardSkeleton mine />;

/** Matches GeneralPostCard layout */
export const GeneralPostCardSkeleton = () => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="relative aspect-[16/10]">
      <Skeleton className="h-full w-full" rounded="none" />
      <Skeleton className="absolute left-3 top-3 h-5 w-14" rounded="full" />
    </div>
    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-2/3" />
      <Skeleton className="mt-3 h-3 w-28" />
    </div>
  </Card>
);

/** Matches BlogGridCard layout */
export const BlogGridCardSkeleton = () => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white">
    <Skeleton className="aspect-[16/10] w-full" rounded="none" />
    <div className="flex flex-1 flex-col p-4 lg:p-5">
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-3/4" />
      <div className="mt-4 flex items-center gap-2.5 border-t border-[#E4E7EC] pt-4">
        <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  </article>
);

/** Matches LatestHubCard layout */
export const BlogHubCardSkeleton = () => (
  <div className="flex h-full w-full gap-3 rounded-xl border border-[#E4E7EC] bg-white p-4 lg:p-5 sm:gap-4">
    <Skeleton className="h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-28 lg:w-28" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2 py-0.5">
      <Skeleton className="h-5 w-16" rounded="full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="mt-1 h-3 w-36" />
    </div>
  </div>
);

/** Matches FeedPost card layout */
export const FeedPostCardSkeleton = () => (
  <Card>
    <div className="flex items-start gap-3 p-4 pb-3">
      <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-16" rounded="full" />
        </div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-5 shrink-0" rounded="full" />
    </div>
    <div className="space-y-2 px-4 pb-3">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
    </div>
    <Skeleton className="mx-4 mb-3 aspect-[16/9] w-[calc(100%-2rem)]" rounded="lg" />
    <div className="flex items-center justify-between border-t border-[#E4E7EC] px-4 py-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex gap-2 border-t border-[#E4E7EC] px-4 py-2.5">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </Card>
);

/** Matches RightSidebar “People you may know” row */
export const SidebarPersonRowSkeleton = () => (
  <li className="flex items-center gap-3 px-4 py-3">
    <Skeleton className="h-8 w-8 shrink-0" rounded="full" />
    <div className="min-w-0 flex-1 space-y-1.5">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="h-8 w-[76px] shrink-0" />
  </li>
);

/** Matches RightSidebar marketplace row */
export const SidebarListingRowSkeleton = () => (
  <li className="px-4 py-3">
    <Skeleton className="h-3.5 w-4/5" />
    <Skeleton className="mt-1.5 h-3 w-2/3" />
    <Skeleton className="mt-2 h-3.5 w-16" />
  </li>
);

/** Matches RightSidebar job row */
export const SidebarJobRowSkeleton = () => (
  <li className="px-4 py-3">
    <Skeleton className="h-3.5 w-4/5" />
    <Skeleton className="mt-1.5 h-3 w-3/5" />
    <Skeleton className="mt-2 h-5 w-16" rounded="full" />
  </li>
);

/** Matches My Applications row on MyJobsView */
export const ApplicationRowSkeleton = () => (
  <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
    <Skeleton className="w-16 shrink-0 self-stretch" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3.5 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-[68px] shrink-0" rounded="md" />
  </div>
);

/** Matches notification list row (NotificationsPageContent) */
export const NotificationRowSkeleton = () => (
  <li className="flex w-full items-start gap-4 px-5 py-4 sm:px-6">
    <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-2/3 max-w-xs" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
      <Skeleton className="mt-1 h-3 w-20" />
    </div>
    <Skeleton className="mt-2 h-2.5 w-2.5 shrink-0" rounded="full" />
  </li>
);

/** Matches Profile MyReports list rows */
export const ReportRowSkeleton = () => (
  <li className="px-5 py-3.5 sm:px-6">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-14 shrink-0" rounded="full" />
    </div>
  </li>
);

/** Matches ProfileHero card */
export const ProfileHeroSkeleton = () => (
  <Card>
    <Skeleton className="h-32 w-full sm:h-36" rounded="none" />
    <div className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
          <Skeleton
            className="-mt-[4.25rem] h-24 w-24 shrink-0 border-[3px] border-white sm:-mt-[4.75rem] sm:h-28 sm:w-28"
            rounded="full"
          />
          <div className="min-w-0 flex-1 space-y-2 sm:pb-0.5">
            <Skeleton className="h-7 w-48 sm:h-8 sm:w-56" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-44" />
            <Skeleton className="mt-1 h-5 w-28" rounded="full" />
          </div>
        </div>
        <Skeleton className="h-9 w-28 shrink-0" />
      </div>
    </div>
  </Card>
);

/** Matches SubscriptionDetailsCard */
export const SubscriptionDetailsCardSkeleton = () => (
  <Card className="h-full">
    <div className="flex items-center gap-2 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="divide-y divide-[#E4E7EC] px-5 sm:px-6">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-3.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton
            className={`h-3.5 ${i === 1 ? 'w-16' : 'w-28'}`}
            rounded={i === 1 ? 'full' : 'md'}
          />
        </div>
      ))}
    </div>
    <div className="border-t border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

/** Matches ContactInfoCard (+ optional professional block) */
export const ContactInfoCardSkeleton = ({ showProfessional = false }) => (
  <Card className="h-full">
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg border border-[#E4E7EC] bg-white p-4"
          >
            <Skeleton className="mb-3 h-9 w-9" rounded="lg" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        ))}
      </div>
      {showProfessional ? (
        <div className="mt-5 border-t border-[#E4E7EC] pt-5">
          <Skeleton className="mb-3 h-4 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
      ) : null}
    </div>
  </Card>
);

/** Matches ProfessionalInfoCard */
export const ProfessionalInfoCardSkeleton = () => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="space-y-2 px-5 py-5 sm:px-6">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  </Card>
);

/** Matches MyReportsCard shell + rows */
export const MyReportsCardSkeleton = () => (
  <Card>
    <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-2 h-3 w-56" />
    </div>
    <ul className="divide-y divide-[#E4E7EC]">
      {Array.from({ length: 3 }, (_, i) => (
        <ReportRowSkeleton key={i} />
      ))}
    </ul>
  </Card>
);

/**
 * Full own-profile page skeleton — mirrors ProfilePageContent premium layout.
 */
export const ProfilePageSkeleton = ({ showSubscription = true, sidebar = false }) =>
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
            <ContactInfoCardSkeleton showProfessional={showSubscription} />
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
        <>
          <ProfessionalInfoCardSkeleton />
          <ContactInfoCardSkeleton />
        </>
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

/**
 * Contact profile page skeleton (hero + professional + contact + activity).
 */
export const ContactProfilePageSkeleton = () => (
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

/** Matches ListingDetailView layout */
export const ListingDetailSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-40" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
      <div className="min-w-0 space-y-5">
        <div>
          <Skeleton className="aspect-[16/10] w-full" rounded="xl" />
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" rounded="xl" />
            ))}
          </div>
        </div>
        <Card>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-16" rounded="full" />
              <Skeleton className="h-5 w-20" rounded="full" />
              <Skeleton className="h-5 w-24" rounded="full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-4/5" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5"
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <aside className="space-y-5">
        <Card className="p-5 sm:p-6">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mt-2 h-3 w-40" />
          <div className="mt-5 space-y-2.5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="mt-5 h-3 w-44" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-full" />
        </Card>
      </aside>
    </div>
  </div>
);

/** Matches JobDetailCard layout */
export const JobDetailSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-28" />
    <Card>
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]" rounded="xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-b border-[#E4E7EC] pb-5">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-14" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
        <div className="mt-6 space-y-2.5">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 h-4 w-4 shrink-0" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
    <Skeleton className="h-10 w-48" />
  </div>
);

/** Matches JobPosterCard ("Posted by") */
export const JobPosterCardSkeleton = () => (
  <div className="rounded-xl border border-[#E4E7EC] bg-white p-4">
    <Skeleton className="h-5 w-24" />
    <div className="mt-3 flex items-start gap-3">
      <Skeleton className="h-11 w-11 shrink-0" rounded="full" />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-44" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="mt-4 h-9 w-full" rounded="lg" />
  </div>
);

/** Matches a row in the job owner's "Applied Candidates" list */
export const CandidateRowSkeleton = () => (
  <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3">
    <Skeleton className="h-9 w-9 shrink-0 self-start" rounded="full" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-[68px] shrink-0" rounded="md" />
  </div>
);

/**
 * Full job detail page: job card on the left, "Posted by" on the right.
 * Render inside the same grid container as JobDetailView.
 */
export const JobDetailPageSkeleton = () => (
  <>
    <div className="min-w-0">
      <JobDetailSkeleton />
    </div>
    <aside className="mt-8 lg:mt-10" aria-busy="true" aria-live="polite">
      <JobPosterCardSkeleton />
    </aside>
  </>
);

/** Matches GeneralPostDetailView layout */
export const GeneralPostDetailSkeleton = () => (
  <div className="space-y-5" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="aspect-[21/9] w-full sm:aspect-[16/7]" rounded="xl" />
    <Skeleton className="h-5 w-16" rounded="full" />
    <Skeleton className="h-8 w-4/5 sm:h-9" />
    <div className="flex flex-wrap gap-4">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3.5 w-24" />
    </div>
    <div className="space-y-3 pt-2">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
    <div className="flex flex-wrap gap-2 pt-2">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

/** Matches StatCard (+ optional hint line used on supplier dashboard) */
export const StatCardSkeleton = ({ showHint = false }) => (
  <Card className="flex h-full flex-col p-4 sm:p-5">
    <Skeleton className="mb-3 h-10 w-10" rounded="lg" />
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className="mt-2 h-6 w-16" />
    {showHint ? (
      <div className="mt-auto pt-3">
        <Skeleton className="h-3 w-28" />
      </div>
    ) : null}
  </Card>
);

/** Matches LineChartCard / BarChartCard */
export const LineChartCardSkeleton = ({ chartHeightClass = 'h-[240px]' }) => (
  <Card className="overflow-hidden">
    <div className="flex items-start justify-between gap-3 border-b border-[#E4E7EC] px-4 py-4 sm:px-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-[120px]" />
    </div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 pt-4 sm:px-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
    <div className="p-4 sm:p-5">
      <Skeleton className={`w-full ${chartHeightClass}`} rounded="lg" />
    </div>
  </Card>
);

/** Alias — same shell as LineChartCardSkeleton */
export const BarChartCardSkeleton = ({
  chartHeightClass = 'h-[180px]',
  ...props
}) => <LineChartCardSkeleton chartHeightClass={chartHeightClass} {...props} />;

/** Matches ProfileSetupForm */
export const ProfileSetupFormSkeleton = () => (
  <Card aria-busy="true" aria-live="polite">
    <Skeleton className="h-32 w-full sm:h-36" rounded="none" />
    <div className="relative border-b border-[#E4E7EC] px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
        <Skeleton
          className="-mt-[4.25rem] h-[104px] w-[104px] shrink-0 border-[3px] border-white sm:-mt-[4.75rem]"
          rounded="full"
        />
        <div className="min-w-0 flex-1 space-y-2 sm:pb-0.5">
          <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
          <Skeleton className="h-3.5 w-full max-w-md" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
    </div>
    <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  </Card>
);

/** Matches BlogDetailView / SupplierBlogDetailView */
export const BlogDetailSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10"
    aria-busy="true"
    aria-live="polite"
  >
    <article className="min-w-0 space-y-4">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-8 w-4/5 sm:h-9" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="aspect-[16/9] w-full" rounded="xl" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
    </article>
    <aside className="min-w-0">
      <Skeleton className="mb-4 h-3 w-28" />
      <ul className="divide-y divide-[#E4E7EC] rounded-xl border border-[#E4E7EC] bg-white">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="flex gap-3 p-4">
            <Skeleton className="h-16 w-16 shrink-0" rounded="lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  </div>
);

/** Matches AdminSettings multi-card form layout */
export const AdminSettingsSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    {Array.from({ length: 3 }, (_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-[#E4E7EC] px-4 py-3.5 sm:px-5">
          <Skeleton className="h-9 w-9 shrink-0" rounded="lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" rounded="full" />
            <Skeleton className="h-8 w-28" rounded="full" />
            <Skeleton className="h-8 w-20" rounded="full" />
          </div>
          <Skeleton className="ml-auto h-9 w-28" />
        </div>
      </Card>
    ))}
  </div>
);

/** Matches AdminAccountForm */
export const AdminAccountFormSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="mt-2 h-3.5 w-64" />
    </div>
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4 border-b border-[#E4E7EC] pb-4">
        <Skeleton className="h-16 w-16" rounded="full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-44" />
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="ml-auto h-9 w-32" />
      </div>
      <div className="mt-8 space-y-4 border-t border-[#E4E7EC] pt-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="ml-auto h-9 w-36" />
      </div>
    </Card>
  </div>
);

/** Matches AdminAdvertisementDetailView */
export const AdvertisementDetailSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-36" />
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11" rounded="lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-5 w-16" rounded="full" />
      </div>
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="aspect-[16/9] w-full" rounded="xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

/** Matches AdminReportDetailView */
export const ReportDetailSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-live="polite">
    <Skeleton className="h-4 w-32" />
    <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-5 py-4">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-3.5 w-full" />
      <Skeleton className="mt-2 h-3.5 w-4/5" />
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }, (_, i) => (
        <Card key={i} className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12" rounded="full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
    <Card className="p-5">
      <Skeleton className="h-4 w-28" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
    </Card>
  </div>
);

/** Matches Messenger two-panel shell */
export const MessengerSkeleton = () => (
  <div
    className="flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white xl:grid xl:grid-cols-[340px_minmax(0,1fr)]"
    style={{ height: '620px' }}
    aria-busy="true"
    aria-live="polite"
  >
    <aside className="flex min-h-0 flex-col border-[#E4E7EC] xl:border-r">
      <div className="space-y-3 border-b border-[#E4E7EC] p-4">
        <Skeleton className="h-9 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" rounded="full" />
          <Skeleton className="h-8 flex-1" rounded="full" />
        </div>
      </div>
      <ul className="divide-y divide-[#E4E7EC]">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </li>
        ))}
      </ul>
    </aside>
    <div className="hidden flex-col xl:flex">
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-5 py-4">
        <Skeleton className="h-10 w-10" rounded="full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex-1 space-y-3 p-5">
        <Skeleton className="ml-auto h-10 w-2/5" rounded="lg" />
        <Skeleton className="h-10 w-1/2" rounded="lg" />
        <Skeleton className="ml-auto h-10 w-1/3" rounded="lg" />
        <Skeleton className="h-10 w-2/5" rounded="lg" />
      </div>
      <div className="border-t border-[#E4E7EC] p-4">
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  </div>
);

const CARD_SKELETONS = {
  contact: ContactCardSkeleton,
  listing: ListingCardSkeleton,
  job: JobCardSkeleton,
  myJob: MyJobCardSkeleton,
  generalPost: GeneralPostCardSkeleton,
  blogGrid: BlogGridCardSkeleton,
  blogHub: BlogHubCardSkeleton,
  feedPost: FeedPostCardSkeleton,
  sidebarPerson: SidebarPersonRowSkeleton,
  sidebarListing: SidebarListingRowSkeleton,
  sidebarJob: SidebarJobRowSkeleton,
  application: ApplicationRowSkeleton,
  candidate: CandidateRowSkeleton,
  jobPoster: JobPosterCardSkeleton,
  reportRow: ReportRowSkeleton,
  notification: NotificationRowSkeleton,
  profileHero: ProfileHeroSkeleton,
  subscriptionDetails: SubscriptionDetailsCardSkeleton,
  contactInfo: ContactInfoCardSkeleton,
  professionalInfo: ProfessionalInfoCardSkeleton,
  myReports: MyReportsCardSkeleton,
  listingDetail: ListingDetailSkeleton,
  jobDetail: JobDetailSkeleton,
  generalPostDetail: GeneralPostDetailSkeleton,
  statCard: StatCardSkeleton,
  lineChart: LineChartCardSkeleton,
  barChart: BarChartCardSkeleton,
  adminSettings: AdminSettingsSkeleton,
  adminAccount: AdminAccountFormSkeleton,
  advertisementDetail: AdvertisementDetailSkeleton,
  reportDetail: ReportDetailSkeleton,
  messenger: MessengerSkeleton,
  profileSetupForm: ProfileSetupFormSkeleton,
  blogDetail: BlogDetailSkeleton,
};

/**
 * Renders one or more card skeletons by variant.
 * Reuse the same variant wherever that card appears.
 */
export function CardSkeleton({
  variant,
  count = 1,
  className = '',
  itemClassName = '',
  as = 'div',
}) {
  const Comp = CARD_SKELETONS[variant];
  if (!Comp) return null;

  const items = Array.from({ length: Math.max(1, count) }, (_, i) =>
    itemClassName ? (
      <div key={i} className={itemClassName}>
        <Comp />
      </div>
    ) : (
      <Comp key={i} />
    ),
  );

  return createElement(
    as,
    { className: className || undefined, 'aria-busy': 'true', 'aria-live': 'polite' },
    items,
  );
}

export { CARD_SKELETONS };
