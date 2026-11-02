import { Outlet } from 'react-router';
import PanelLayout from './panel/PanelLayout';
import { adminNavItems } from '@/components/navigation/navbar/nav';

const AdminLayout = () => (
  <PanelLayout navItems={adminNavItems} profilePath="/admin/profile">
    <Outlet />
  </PanelLayout>
);

export default AdminLayout;
