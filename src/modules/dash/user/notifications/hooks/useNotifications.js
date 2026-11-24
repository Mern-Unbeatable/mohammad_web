import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  fetchUserNotifications,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  clearNotificationsError,
  toNotificationListModel,
} from '@/features/dash/user/notifications';
import { resolveNotificationLink } from '@/features/messages';
import { CHAT_BASE_PATHS } from '@/features/messages/chatPaths';
import { NOTIFICATIONS_QUERY } from '../constant/constants';

/** Notification list, open (mark read + follow link) and mark-all-read. */
export const useNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading, actionLoading, error } = useSelector(
    (state) => state.userNotifications,
  );

  useEffect(() => {
    dispatch(clearNotificationsError());
    dispatch(fetchUserNotifications(NOTIFICATIONS_QUERY));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const items = useMemo(
    () => (notifications || []).map(toNotificationListModel).filter(Boolean),
    [notifications],
  );

  const openNotification = async (item) => {
    if (item.unread) await dispatch(markUserNotificationRead(item.id));
    if (!item.link) return;
    const { to, failed } = await resolveNotificationLink(item.link, CHAT_BASE_PATHS.USER);
    if (failed) toast.error('That conversation is no longer available');
    navigate(to);
  };

  const markAllRead = async () => {
    if (actionLoading) return;
    const result = await dispatch(markAllUserNotificationsRead());
    if (markAllUserNotificationsRead.fulfilled.match(result)) {
      toast.success('All notifications marked as read');
    }
  };

  return { items, loading, actionLoading, openNotification, markAllRead };
};
