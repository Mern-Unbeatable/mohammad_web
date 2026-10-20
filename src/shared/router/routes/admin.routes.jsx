import { RequireRole } from '@/shared/router/guards';
import { USER_ROLES } from '@/shared/constants/roles';
import { CHAT_BASE_PATHS } from '@/features/messages/chatPaths';
import { lazyPage } from '@/shared/router/utils/lazyPage';
import AdminLayout from '@/layouts/AdminLayout';
import PanelNotFound from '@/modules/error/PanelNotFound';
import { buildChatRoute } from './chat.routes';

const AdminDashboardView = lazyPage(() => import('@/modules/dash/admin/dashboard/pages/AdminDashboardView'));
const AdminUsersView = lazyPage(() => import('@/modules/dash/admin/users/pages/AdminUsersView'));
const AdminUserDetailView = lazyPage(() => import('@/modules/dash/admin/users/pages/AdminUserDetailView'));
const AdminRecruitmentView = lazyPage(() => import('@/modules/dash/admin/recruitment/pages/AdminRecruitmentView'));
const AdminJobDetailView = lazyPage(() => import('@/modules/dash/admin/recruitment/pages/AdminJobDetailView'));
const AdminChatView = lazyPage(() => import('@/modules/dash/admin/messages/pages/AdminChatView'));
const AdminChatInboxView = lazyPage(() => import('@/modules/dash/admin/messages/pages/AdminChatInboxView'));
const ChatModerationView = lazyPage(
  () => import('@/modules/dash/admin/messages/pages/AdminChatModerationView'),
);
const AdminGeneralView = lazyPage(() => import('@/modules/dash/admin/general/pages/AdminGeneralView'));
const AdminGeneralPostDetailView = lazyPage(
  () => import('@/modules/dash/admin/general/pages/AdminGeneralPostDetailView'),
);
const AdminMarketplaceView = lazyPage(() => import('@/modules/dash/admin/marketplace/pages/AdminMarketplaceView'));
const AdminListingDetailView = lazyPage(() => import('@/modules/dash/admin/marketplace/pages/AdminListingDetailView'));
const AdminReportsView = lazyPage(() => import('@/modules/dash/admin/reports/pages/AdminReportsView'));
const AdminReportDetailView = lazyPage(() => import('@/modules/dash/admin/reports/pages/AdminReportDetailView'));
const AdminAdvertisementView = lazyPage(() => import('@/modules/dash/admin/ads/pages/AdminAdvertisementView'));
const AdminAdvertisementDetailView = lazyPage(
  () => import('@/modules/dash/admin/ads/pages/AdminAdvertisementDetailView'),
);
const AdminBlogsView = lazyPage(() => import('@/modules/dash/admin/blogs/pages/AdminBlogsView'));
const AdminCreateBlogView = lazyPage(() => import('@/modules/dash/admin/blogs/pages/AdminCreateBlogView'));
const AdminStatisticsView = lazyPage(() => import('@/modules/dash/admin/statistics/pages/AdminStatisticsView'));
const AdminSettingsView = lazyPage(() => import('@/modules/dash/admin/settings/pages/AdminSettingsView'));
const AdminProfileView = lazyPage(() => import('@/modules/dash/admin/profile/pages/AdminProfileView'));

export const adminRoutes = {
  path: '/admin',
  element: <RequireRole allowedRoles={[USER_ROLES.ADMIN]} />,
  handle: { requiredRole: USER_ROLES.ADMIN, audience: 'admin' },
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboardView />, handle: { title: 'Admin dashboard' } },
        { path: 'users', element: <AdminUsersView />, handle: { title: 'Users' } },
        {
          path: 'users/:userId',
          element: <AdminUserDetailView />,
          handle: { title: 'User detail' },
        },
        { path: 'recruitment', element: <AdminRecruitmentView />, handle: { title: 'Recruitment' } },
        {
          path: 'recruitment/:jobId',
          element: <AdminJobDetailView />,
          handle: { title: 'Job detail' },
        },
        buildChatRoute({
          path: 'chat',
          basePath: CHAT_BASE_PATHS.ADMIN,
          shell: <AdminChatView />,
          inbox: <AdminChatInboxView />,
          extraRoutes: [
            {
              path: 'moderation',
              element: <ChatModerationView />,
              handle: { title: 'Chat moderation' },
            },
          ],
        }),
        { path: 'general', element: <AdminGeneralView />, handle: { title: 'General' } },
        {
          path: 'general/:postId',
          element: <AdminGeneralPostDetailView />,
          handle: { title: 'Post detail' },
        },
        { path: 'marketplace', element: <AdminMarketplaceView />, handle: { title: 'Marketplace' } },
        {
          path: 'marketplace/:listingId',
          element: <AdminListingDetailView />,
          handle: { title: 'Listing detail' },
        },
        { path: 'reports', element: <AdminReportsView />, handle: { title: 'Reports' } },
        {
          path: 'reports/:reportId',
          element: <AdminReportDetailView />,
          handle: { title: 'Report detail' },
        },
        {
          path: 'advertisement',
          element: <AdminAdvertisementView />,
          handle: { title: 'Advertisement' },
        },
        {
          path: 'advertisement/:adId',
          element: <AdminAdvertisementDetailView />,
          handle: { title: 'Ad detail' },
        },
        { path: 'blogs', element: <AdminBlogsView />, handle: { title: 'Blogs' } },
        { path: 'blogs/new', element: <AdminCreateBlogView />, handle: { title: 'New blog' } },
        { path: 'statistics', element: <AdminStatisticsView />, handle: { title: 'Statistics' } },
        { path: 'settings', element: <AdminSettingsView />, handle: { title: 'Settings' } },
        { path: 'profile', element: <AdminProfileView />, handle: { title: 'Profile' } },
        { path: '*', element: <PanelNotFound />, handle: { title: 'Not found' } },
      ],
    },
  ],
};
