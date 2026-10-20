import { Navigate } from 'react-router';
import { RequireRole } from '@/modules/auth';
import { USER_ROLES } from '@/shared/constants/roles';
import { CHAT_BASE_PATHS } from '@/shared/constants/chat';
import { lazyPage } from '@/shared/routing/lazyPage';
import UserLayout from '@/layouts/UserLayout';
import { buildChatRoute, legacyChatRoute } from './chat.routes';

const FeedView = lazyPage(() => import('@/modules/dash/user/pages/feed/FeedView'));
const ContactsView = lazyPage(() => import('@/modules/dash/user/pages/contacts/ContactsView'));
const ContactProfileView = lazyPage(() => import('@/modules/dash/user/pages/contacts/ContactProfileView'));
const MarketplaceView = lazyPage(() => import('@/modules/dash/user/pages/marketplace/MarketplaceView'));
const SavedListingsView = lazyPage(() => import('@/modules/dash/user/pages/marketplace/SavedListingsView'));
const MyListingsView = lazyPage(() => import('@/modules/dash/user/pages/marketplace/MyListingsView'));
const CreateListingView = lazyPage(() => import('@/modules/dash/user/pages/marketplace/CreateListingView'));
const ListingDetailView = lazyPage(() => import('@/modules/dash/user/pages/marketplace/ListingDetailView'));
const RecruitmentView = lazyPage(() => import('@/modules/dash/user/pages/recruitment/RecruitmentView'));
const MyJobsView = lazyPage(() => import('@/modules/dash/user/pages/recruitment/MyJobsView'));
const PostJobView = lazyPage(() => import('@/modules/dash/user/pages/recruitment/PostJobView'));
const JobDetailView = lazyPage(() => import('@/modules/dash/user/pages/recruitment/JobDetailView'));
const GeneralView = lazyPage(() => import('@/modules/dash/user/pages/general/GeneralView'));
const MyGeneralPostsView = lazyPage(() => import('@/modules/dash/user/pages/general/MyGeneralPostsView'));
const GeneralPostDetailView = lazyPage(() => import('@/modules/dash/user/pages/general/GeneralPostDetailView'));
const MessagesView = lazyPage(() => import('@/modules/dash/user/pages/messages/MessagesView'));
const BlogsView = lazyPage(() => import('@/modules/dash/user/pages/blogs/BlogsView'));
const BlogDetailView = lazyPage(() => import('@/modules/dash/user/pages/blogs/BlogDetailView'));
const NotificationsView = lazyPage(() => import('@/modules/dash/user/pages/notifications/NotificationsView'));
const SubscriptionView = lazyPage(() => import('@/modules/dash/user/pages/subscription/SubscriptionView'));
const ProfileView = lazyPage(() => import('@/modules/dash/user/pages/profile/ProfileView'));
const ProfileSetupView = lazyPage(() => import('@/modules/dash/user/pages/profile/ProfileSetupView'));
const SearchView = lazyPage(() => import('@/modules/dash/user/pages/search/SearchView'));

export const userRoutes = {
  element: <RequireRole allowedRoles={[USER_ROLES.USER]} />,
  handle: { requiredRole: USER_ROLES.USER, audience: 'user' },
  children: [
    {
      element: <UserLayout />,
      children: [
        { path: '/feed', element: <FeedView />, handle: { title: 'Feed' } },
        { path: '/search', element: <SearchView />, handle: { title: 'Search' } },
        { path: '/contacts', element: <ContactsView />, handle: { title: 'Contacts' } },
        {
          path: '/contacts/:contactId',
          element: <ContactProfileView />,
          handle: { title: 'Contact' },
        },
        { path: '/marketplace', element: <MarketplaceView />, handle: { title: 'Marketplace' } },
        {
          path: '/marketplace/saved',
          element: <SavedListingsView />,
          handle: { title: 'Saved listings' },
        },
        {
          path: '/marketplace/my-listings',
          element: <MyListingsView />,
          handle: { title: 'My listings' },
        },
        {
          path: '/marketplace/create',
          element: <CreateListingView />,
          handle: { title: 'Create listing' },
        },
        {
          path: '/marketplace/:listingId/edit',
          element: <CreateListingView />,
          handle: { title: 'Edit listing' },
        },
        {
          path: '/marketplace/:listingId',
          element: <ListingDetailView />,
          handle: { title: 'Listing' },
        },
        { path: '/recruitment', element: <RecruitmentView />, handle: { title: 'Recruitment' } },
        {
          path: '/recruitment/my-jobs',
          element: <MyJobsView />,
          handle: { title: 'My jobs' },
        },
        {
          path: '/recruitment/create',
          element: <PostJobView />,
          handle: { title: 'Post job' },
        },
        {
          path: '/recruitment/:jobId/edit',
          element: <PostJobView />,
          handle: { title: 'Edit job' },
        },
        {
          path: '/recruitment/:jobId',
          element: <JobDetailView />,
          handle: { title: 'Job' },
        },
        { path: '/general', element: <GeneralView />, handle: { title: 'General' } },
        {
          path: '/general/my-posts',
          element: <MyGeneralPostsView />,
          handle: { title: 'My posts' },
        },
        {
          path: '/general/:postId',
          element: <GeneralPostDetailView />,
          handle: { title: 'Post' },
        },
        buildChatRoute({
          path: CHAT_BASE_PATHS.USER,
          basePath: CHAT_BASE_PATHS.USER,
          inbox: <MessagesView />,
        }),
        legacyChatRoute('/messages', CHAT_BASE_PATHS.USER),
        { path: '/blogs', element: <BlogsView />, handle: { title: 'Blogs' } },
        { path: '/blogs/:slug', element: <BlogDetailView />, handle: { title: 'Blog' } },
        {
          path: '/notifications',
          element: <NotificationsView />,
          handle: { title: 'Notifications' },
        },
        {
          path: '/subscription',
          element: <SubscriptionView />,
          handle: { title: 'Subscription' },
        },
        { path: '/profile', element: <ProfileView />, handle: { title: 'Profile' } },
        {
          path: '/profile/edit',
          element: <ProfileSetupView />,
          handle: { title: 'Edit profile' },
        },
        { path: '/dashboard', element: <Navigate to="/feed" replace /> },
      ],
    },
  ],
};
