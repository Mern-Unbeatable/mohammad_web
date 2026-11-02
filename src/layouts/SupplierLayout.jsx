import { Outlet } from 'react-router';
import PanelLayout from './panel/PanelLayout';
import { supplierNavItems } from '@/components/navigation/navbar/nav';
import { PROFILE_PATH } from '@/modules/dash/supplier/profile';
import {
  fetchSupplierUnreadNotificationCount,
  selectSupplierUnreadNotificationCount,
} from '@/features/dash/supplier/notifications';
import {
  fetchSupplierNewApplicationCounts,
  selectSupplierNewApplicationTotal,
} from '@/features/dash/supplier/recruitment';
import { useNotificationBadge } from '@/shared/hooks/useNotificationBadge';

const supplierNotificationBadge = {
  fetchCount: fetchSupplierUnreadNotificationCount,
  selectCount: selectSupplierUnreadNotificationCount,
};

// Applying to a job notifies its owner, so this refreshes on the same events.
const supplierNewApplicationsBadge = {
  fetchCount: fetchSupplierNewApplicationCounts,
  selectCount: selectSupplierNewApplicationTotal,
};

const SupplierLayout = () => {
  const unreadNotifications = useNotificationBadge(supplierNotificationBadge);
  const newApplications = useNotificationBadge(supplierNewApplicationsBadge);
  return (
    <PanelLayout
      navItems={supplierNavItems}
      badgeCounts={{ unreadNotifications, newApplications }}
      profilePath={PROFILE_PATH}
    >
      <Outlet />
    </PanelLayout>
  );
};

export default SupplierLayout;
