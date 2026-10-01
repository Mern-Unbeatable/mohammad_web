import { Outlet } from 'react-router';
import PanelLayout from '@/shared/layout/PanelLayout/PanelLayout';
import { supplierNavItems } from '@/modules/supplier/config/nav';
import {
  fetchSupplierUnreadNotificationCount,
  selectSupplierUnreadNotificationCount,
} from '@/features/supplier/notifications';
import { useNotificationBadge } from '@/shared/hooks/useNotificationBadge';

const supplierNotificationBadge = {
  fetchCount: fetchSupplierUnreadNotificationCount,
  selectCount: selectSupplierUnreadNotificationCount,
};

const SupplierLayout = () => {
  const unreadNotifications = useNotificationBadge(supplierNotificationBadge);
  return (
    <PanelLayout navItems={supplierNavItems} badgeCounts={{ unreadNotifications }}>
      <Outlet />
    </PanelLayout>
  );
};

export default SupplierLayout;
