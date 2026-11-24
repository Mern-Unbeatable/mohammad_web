import { useEffect } from 'react';
import { useLayoutChrome } from '@/shared/context/useLayoutChrome';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { MOBILE_QUERY } from '../constant/constants';

/**
 * Below the desktop breakpoint the dashboard messenger fills the viewport:
 * page scroll is locked and the bottom nav hides while a chat is open.
 */
export function useMobileChatLayout({ isPanel, mobilePanel }) {
  const { setBottomNavHidden } = useLayoutChrome();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const fillsViewport = !isPanel && isMobile;

  useBodyScrollLock(fillsViewport, { includeRoot: true });

  useEffect(() => {
    if (isPanel) return undefined;
    setBottomNavHidden(isMobile && mobilePanel === 'chat');
    return () => setBottomNavHidden(false);
  }, [isPanel, isMobile, mobilePanel, setBottomNavHidden]);
}
