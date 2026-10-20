import { Outlet } from 'react-router';
import PanelLayout from '@/components/navigation/panel/PanelLayout';
import { supplierNavItems } from '@/components/navigation/navbar/nav';
import {
  fetchSupplierUnreadNotificationCount,
  selectSupplierUnreadNotificationCount,
} from '@/features/dash/supplier/notifications';
import { useNotificationBadge } from '@/shared/hooks/useNotificationBadge';

const supplierNotificationBadge = {
  fetchCount: fetchSupplierUnreadNotificationCount,
  selectCount: selectSupplierUnreadNotificationCount,
};

const SupplierLayout = () => {
  const unreadNotifications = useNotificationBadge(supplierNotificationBadge);
  return (
    <PanelLayout
      navItems={supplierNavItems}
      badgeCounts={{ unreadNotifications }}
      profilePath="/supplier/profile"
    >
      <Outlet />
    </PanelLayout>
  );
};

export default SupplierLayout;
