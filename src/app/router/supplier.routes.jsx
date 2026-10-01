import RequireRole from '@/shared/auth/RequireRole';
import { USER_ROLES } from '@/shared/constants/roles';
import { CHAT_BASE_PATHS } from '@/shared/constants/chat';
import { lazyPage } from '@/shared/routing/lazyPage';
import SupplierLayout from '@/modules/supplier/layout/SupplierLayout';
import PanelNotFound from '@/shared/pages/PanelNotFound';
import { buildChatRoute, legacyChatRoute } from './chat.routes';

const SupplierDashboardView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierDashboardView'),
);
const SupplierAdsView = lazyPage(() => import('@/modules/supplier/pages/SupplierAdsView'));
const SupplierAdDetailView = lazyPage(() => import('@/modules/supplier/pages/SupplierAdDetailView'));
const SupplierGeneralView = lazyPage(() => import('@/modules/supplier/pages/SupplierGeneralView'));
const SupplierMyGeneralPostsView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierMyGeneralPostsView'),
);
const SupplierGeneralPostDetailView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierGeneralPostDetailView'),
);
const SupplierMessagesView = lazyPage(() => import('@/modules/supplier/pages/SupplierMessagesView'));
const SupplierContactsView = lazyPage(() => import('@/modules/supplier/pages/SupplierContactsView'));
const SupplierContactProfileView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierContactProfileView'),
);
const SupplierRecruitmentView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierRecruitmentView'),
);
const SupplierMyJobsView = lazyPage(() => import('@/modules/supplier/pages/SupplierMyJobsView'));
const SupplierJobDetailView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierJobDetailView'),
);
const SupplierPostJobView = lazyPage(() => import('@/modules/supplier/pages/SupplierPostJobView'));
const SupplierBlogsView = lazyPage(() => import('@/modules/supplier/pages/SupplierBlogsView'));
const SupplierBlogDetailView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierBlogDetailView'),
);
const SupplierNotificationsView = lazyPage(
  () => import('@/modules/supplier/pages/SupplierNotificationsView'),
);
const SupplierProfileView = lazyPage(() => import('@/modules/supplier/pages/SupplierProfileView'));

export const supplierRoutes = {
  path: '/supplier',
  element: <RequireRole allowedRoles={[USER_ROLES.SUPPLIER]} />,
  handle: { requiredRole: USER_ROLES.SUPPLIER, audience: 'supplier' },
  children: [
    {
      element: <SupplierLayout />,
      children: [
        { index: true, element: <SupplierDashboardView />, handle: { title: 'Supplier dashboard' } },
        { path: 'ads', element: <SupplierAdsView />, handle: { title: 'Ads' } },
        { path: 'ads/:adId', element: <SupplierAdDetailView />, handle: { title: 'Ad detail' } },
        { path: 'general', element: <SupplierGeneralView />, handle: { title: 'General' } },
        {
          path: 'general/my-posts',
          element: <SupplierMyGeneralPostsView />,
          handle: { title: 'My posts' },
        },
        {
          path: 'general/:postId',
          element: <SupplierGeneralPostDetailView />,
          handle: { title: 'Post detail' },
        },
        { path: 'contacts', element: <SupplierContactsView />, handle: { title: 'Contacts' } },
        {
          path: 'contacts/:contactId',
          element: <SupplierContactProfileView />,
          handle: { title: 'Contact' },
        },
        {
          path: 'recruitment',
          element: <SupplierRecruitmentView />,
          handle: { title: 'Recruitment' },
        },
        {
          path: 'recruitment/my-jobs',
          element: <SupplierMyJobsView />,
          handle: { title: 'My jobs' },
        },
        {
          path: 'recruitment/create',
          element: <SupplierPostJobView />,
          handle: { title: 'Post job' },
        },
        {
          path: 'recruitment/:jobId',
          element: <SupplierJobDetailView />,
          handle: { title: 'Job detail' },
        },
        buildChatRoute({
          path: 'chat',
          basePath: CHAT_BASE_PATHS.SUPPLIER,
          inbox: <SupplierMessagesView />,
        }),
        legacyChatRoute('messages', CHAT_BASE_PATHS.SUPPLIER),
        { path: 'blogs', element: <SupplierBlogsView />, handle: { title: 'Blogs' } },
        {
          path: 'blogs/:slug',
          element: <SupplierBlogDetailView />,
          handle: { title: 'Blog' },
        },
        {
          path: 'notifications',
          element: <SupplierNotificationsView />,
          handle: { title: 'Notifications' },
        },
        { path: 'profile', element: <SupplierProfileView />, handle: { title: 'Profile' } },
        { path: '*', element: <PanelNotFound />, handle: { title: 'Not found' } },
      ],
    },
  ],
};
