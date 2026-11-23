import { Outlet } from 'react-router';
import PanelLayout from '@/shared/layout/PanelLayout/PanelLayout';
import { adminNavItems } from '@/modules/admin/config/nav';

const AdminLayout = () => (
  <PanelLayout navItems={adminNavItems}>
    <Outlet />
  </PanelLayout>
);

export default AdminLayout;
