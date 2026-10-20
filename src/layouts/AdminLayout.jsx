import { Outlet } from 'react-router';
import PanelLayout from '@/components/navigation/panel/PanelLayout';
import { adminNavItems } from '@/modules/dash/admin/config/nav';

const AdminLayout = () => (
  <PanelLayout navItems={adminNavItems} profilePath="/admin/profile">
    <Outlet />
  </PanelLayout>
);

export default AdminLayout;
