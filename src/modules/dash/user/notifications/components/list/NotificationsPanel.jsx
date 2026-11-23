import Card from '@/components/ui/Card';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationsHeader from './NotificationsHeader';
import NotificationList from './NotificationList';

/** Notifications card wired to the user store. Wrap in Container or PanelPage per layout. */
const NotificationsPanel = () => {
  const { items, loading, actionLoading, openNotification, markAllRead } = useNotifications();

  return (
    <Card>
      <NotificationsHeader onMarkAllRead={markAllRead} disabled={actionLoading} />
      <NotificationList items={items} loading={loading} onOpen={openNotification} />
    </Card>
  );
};

export default NotificationsPanel;
