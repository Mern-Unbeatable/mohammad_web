import { Navigate } from 'react-router';
import { RequireRole } from '@/shared/router/guards';
import { USER_ROLES } from '@/shared/constants/roles';
import { CHAT_BASE_PATHS } from '@/features/messages/chatPaths';
import { lazyPage } from '@/shared/router/utils/lazyPage';
import UserLayout from '@/layouts/UserLayout';
import { buildChatRoute, legacyChatRoute } from './chat.routes';

const FeedView = lazyPage(() => import('@/modules/dash/user/feed/pages/FeedView'));
const ContactsView = lazyPage(() => import('@/modules/dash/user/contacts/pages/ContactsView'));
const ContactProfileView = lazyPage(() => import('@/modules/dash/user/contacts/pages/ContactProfileView'));
const MarketplaceView = lazyPage(() => import('@/modules/dash/user/marketplace/pages/MarketplaceView'));
const SavedListingsView = lazyPage(() => import('@/modules/dash/user/marketplace/pages/SavedListingsView'));
const MyListingsView = lazyPage(() => import('@/modules/dash/user/marketplace/pages/MyListingsView'));
const CreateListingView = lazyPage(() => import('@/modules/dash/user/marketplace/pages/CreateListingView'));
const ListingDetailView = lazyPage(() => import('@/modules/dash/user/marketplace/pages/ListingDetailView'));
const RecruitmentView = lazyPage(() => import('@/modules/dash/user/recruitment/pages/RecruitmentView'));
const MyJobsView = lazyPage(() => import('@/modules/dash/user/recruitment/pages/MyJobsView'));
const PostJobView = lazyPage(() => import('@/modules/dash/user/recruitment/pages/PostJobView'));
const JobDetailView = lazyPage(() => import('@/modules/dash/user/recruitment/pages/JobDetailView'));
const GeneralView = lazyPage(() => import('@/modules/dash/user/general/pages/GeneralView'));
const MyGeneralPostsView = lazyPage(() => import('@/modules/dash/user/general/pages/MyGeneralPostsView'));
const GeneralPostDetailView = lazyPage(() => import('@/modules/dash/user/general/pages/GeneralPostDetailView'));
const MessagesView = lazyPage(() => import('@/modules/dash/user/messages/pages/MessagesView'));
const BlogsView = lazyPage(() => import('@/modules/dash/user/blogs/pages/BlogsView'));
const BlogDetailView = lazyPage(() => import('@/modules/dash/user/blogs/pages/BlogDetailView'));
const NotificationsView = lazyPage(() => import('@/modules/dash/user/notifications/pages/NotificationsView'));
const SubscriptionView = lazyPage(() => import('@/modules/dash/user/subscription/pages/SubscriptionView'));
const ProfileView = lazyPage(() => import('@/modules/dash/user/profile/pages/ProfileView'));
const ProfileSetupView = lazyPage(() => import('@/modules/dash/user/profile/pages/ProfileSetupView'));
const SearchView = lazyPage(() => import('@/modules/dash/user/search/pages/SearchView'));

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
