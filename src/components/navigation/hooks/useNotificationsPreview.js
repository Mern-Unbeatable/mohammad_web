import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  markUserNotificationRead,
  notificationsApi,
  toNotificationListModel,
} from '@/features/dash/user/notifications';
import { resolveNotificationLink } from '@/features/messages';
import { CHAT_BASE_PATHS } from '@/shared/constants/chat';
import { NOTIFICATIONS_PATH, NOTIFICATIONS_PREVIEW_LIMIT } from '../constant/constants';

/** Latest notifications for the navbar hover preview; opening one marks it read. */
export function useNotificationsPreview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  const loadPreview = async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const { data } = await notificationsApi.getNotifications({
        page: 1,
        pageSize: NOTIFICATIONS_PREVIEW_LIMIT,
        sort: 'desc',
      });
      if (requestId !== requestRef.current) return;
      setItems((data || []).map(toNotificationListModel).filter(Boolean));
    } catch (err) {
      if (requestId === requestRef.current) {
        toast.error(notificationsApi.getApiErrorMessage(err, 'Failed to load notifications'));
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  const openItem = async (item) => {
    if (item.unread) {
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, unread: false } : row)),
      );
      dispatch(markUserNotificationRead(item.id));
    }
    if (!item.link) {
      navigate(NOTIFICATIONS_PATH);
      return;
    }
    const { to, failed } = await resolveNotificationLink(item.link, CHAT_BASE_PATHS.USER);
    if (failed) toast.error('That conversation is no longer available');
    navigate(to);
  };

  return { items, loading, loadPreview, openItem };
}
