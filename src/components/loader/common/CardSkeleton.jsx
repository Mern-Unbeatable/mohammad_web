import { createElement } from 'react';
import ContactCardSkeleton from '@/components/loader/skeletons/cards/ContactCardSkeleton';
import ListingCardSkeleton from '@/components/loader/skeletons/cards/ListingCardSkeleton';
import JobCardSkeleton from '@/components/loader/skeletons/cards/JobCardSkeleton';
import MyJobCardSkeleton from '@/components/loader/skeletons/cards/MyJobCardSkeleton';
import JobGridCardSkeleton from '@/components/loader/skeletons/cards/JobGridCardSkeleton';
import GeneralPostCardSkeleton from '@/components/loader/skeletons/cards/GeneralPostCardSkeleton';
import BlogGridCardSkeleton from '@/components/loader/skeletons/cards/BlogGridCardSkeleton';
import BlogHubCardSkeleton from '@/components/loader/skeletons/cards/BlogHubCardSkeleton';
import FeedPostCardSkeleton from '@/components/loader/skeletons/cards/FeedPostCardSkeleton';
import ProfileHeroSkeleton from '@/components/loader/skeletons/cards/ProfileHeroSkeleton';
import SubscriptionDetailsCardSkeleton from '@/components/loader/skeletons/cards/SubscriptionDetailsCardSkeleton';
import ContactInfoCardSkeleton from '@/components/loader/skeletons/cards/ContactInfoCardSkeleton';
import ProfessionalInfoCardSkeleton from '@/components/loader/skeletons/cards/ProfessionalInfoCardSkeleton';
import MyReportsCardSkeleton from '@/components/loader/skeletons/cards/MyReportsCardSkeleton';
import JobPosterCardSkeleton from '@/components/loader/skeletons/cards/JobPosterCardSkeleton';
import StatCardSkeleton from '@/components/loader/skeletons/cards/StatCardSkeleton';
import SidebarPersonRowSkeleton from '@/components/loader/skeletons/rows/SidebarPersonRowSkeleton';
import SidebarListingRowSkeleton from '@/components/loader/skeletons/rows/SidebarListingRowSkeleton';
import SidebarJobRowSkeleton from '@/components/loader/skeletons/rows/SidebarJobRowSkeleton';
import ApplicationRowSkeleton from '@/components/loader/skeletons/rows/ApplicationRowSkeleton';
import NotificationRowSkeleton from '@/components/loader/skeletons/rows/NotificationRowSkeleton';
import ReportRowSkeleton from '@/components/loader/skeletons/rows/ReportRowSkeleton';
import CandidateRowSkeleton from '@/components/loader/skeletons/rows/CandidateRowSkeleton';
import LineChartCardSkeleton from '@/components/loader/skeletons/charts/LineChartCardSkeleton';
import BarChartCardSkeleton from '@/components/loader/skeletons/charts/BarChartCardSkeleton';
import ListingDetailSkeleton from '@/components/loader/skeletons/pages/ListingDetailSkeleton';
import JobDetailSkeleton from '@/components/loader/skeletons/pages/JobDetailSkeleton';
import GeneralPostDetailSkeleton from '@/components/loader/skeletons/pages/GeneralPostDetailSkeleton';
import ProfileSetupFormSkeleton from '@/components/loader/skeletons/pages/ProfileSetupFormSkeleton';
import BlogDetailSkeleton from '@/components/loader/skeletons/pages/BlogDetailSkeleton';
import AdminSettingsSkeleton from '@/components/loader/skeletons/pages/AdminSettingsSkeleton';
import AdminAccountFormSkeleton from '@/components/loader/skeletons/pages/AdminAccountFormSkeleton';
import AdvertisementDetailSkeleton from '@/components/loader/skeletons/pages/AdvertisementDetailSkeleton';
import ReportDetailSkeleton from '@/components/loader/skeletons/pages/ReportDetailSkeleton';
import MessengerSkeleton from '@/components/loader/skeletons/pages/MessengerSkeleton';

const CARD_SKELETONS = {
  contact: ContactCardSkeleton,
  listing: ListingCardSkeleton,
  job: JobCardSkeleton,
  myJob: MyJobCardSkeleton,
  jobGrid: JobGridCardSkeleton,
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
