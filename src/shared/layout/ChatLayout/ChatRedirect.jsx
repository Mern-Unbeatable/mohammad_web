import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { parseLegacyChatLink, resolveLegacyChatLink } from '@/features/messages';
import { chatPath } from '@/shared/constants/chat';
import PageLoadingFallback from '@/shared/routing/PageLoadingFallback';
import { useChatRoute } from './useChatRoute';

/**
 * Chat index / unknown-path fallback. Also upgrades legacy query links
 * (`?user=<id>`, `?conversation=<id>`) still stored in older notifications.
 */
const ChatRedirect = () => {
  const { basePath } = useChatRoute();
  const { search } = useLocation();
  const link = search ? `${basePath}${search}` : null;
  const isLegacy = Boolean(parseLegacyChatLink(link));
  const [resolved, setResolved] = useState(null);

  useEffect(() => {
    if (!isLegacy) return undefined;
    let cancelled = false;
    resolveLegacyChatLink(link, basePath)
      .catch(() => {
        toast.error('That conversation is no longer available');
        return chatPath(basePath);
      })
      .then((to) => {
        if (!cancelled) setResolved({ link, to });
      });
    return () => {
      cancelled = true;
    };
  }, [isLegacy, link, basePath]);

  if (isLegacy) {
    if (resolved?.link !== link) return <PageLoadingFallback label="Opening conversation" />;
    return <Navigate to={resolved.to} replace />;
  }
  return <Navigate to={chatPath(basePath)} replace />;
};

export default ChatRedirect;
