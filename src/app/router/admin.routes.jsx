import RequireRole from '@/shared/auth/RequireRole';
import { USER_ROLES } from '@/shared/constants/roles';
import { CHAT_BASE_PATHS } from '@/shared/constants/chat';
import { lazyPage } from '@/shared/routing/lazyPage';
import AdminLayout from '@/modules/admin/layout/AdminLayout';
import PanelNotFound from '@/shared/pages/PanelNotFound';
import { buildChatRoute } from './chat.routes';

const AdminDashboardView = lazyPage(() => import('@/modules/admin/pages/AdminDashboardView'));
const AdminUsersView = lazyPage(() => import('@/modules/admin/pages/AdminUsersView'));
const AdminUserDetailView = lazyPage(() => import('@/modules/admin/pages/AdminUserDetailView'));
const AdminRecruitmentView = lazyPage(() => import('@/modules/admin/pages/AdminRecruitmentView'));
const AdminJobDetailView = lazyPage(() => import('@/modules/admin/pages/AdminJobDetailView'));
const AdminChatView = lazyPage(() => import('@/modules/admin/pages/AdminChatView'));
const AdminChatInboxView = lazyPage(() => import('@/modules/admin/pages/AdminChatInboxView'));
const ChatModerationView = lazyPage(
  () => import('@/modules/admin/components/chat/ChatModerationPanel'),
);
const AdminGeneralView = lazyPage(() => import('@/modules/admin/pages/AdminGeneralView'));
const AdminGeneralPostDetailView = lazyPage(
  () => import('@/modules/admin/pages/AdminGeneralPostDetailView'),
);
const AdminMarketplaceView = lazyPage(() => import('@/modules/admin/pages/AdminMarketplaceView'));
const AdminListingDetailView = lazyPage(() => import('@/modules/admin/pages/AdminListingDetailView'));
const AdminReportsView = lazyPage(() => import('@/modules/admin/pages/AdminReportsView'));
const AdminReportDetailView = lazyPage(() => import('@/modules/admin/pages/AdminReportDetailView'));
const AdminAdvertisementView = lazyPage(() => import('@/modules/admin/pages/AdminAdvertisementView'));
const AdminAdvertisementDetailView = lazyPage(
  () => import('@/modules/admin/pages/AdminAdvertisementDetailView'),
);
const AdminBlogsView = lazyPage(() => import('@/modules/admin/pages/AdminBlogsView'));
const AdminCreateBlogView = lazyPage(() => import('@/modules/admin/pages/AdminCreateBlogView'));
const AdminStatisticsView = lazyPage(() => import('@/modules/admin/pages/AdminStatisticsView'));
const AdminSettingsView = lazyPage(() => import('@/modules/admin/pages/AdminSettingsView'));
const AdminProfileView = lazyPage(() => import('@/modules/admin/pages/AdminProfileView'));

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
