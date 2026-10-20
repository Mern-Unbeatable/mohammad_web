import { useEffect } from 'react';
import { useLayoutChrome } from '@/shared/context/LayoutChromeContext';
import { MOBILE_QUERY } from '../constant/constants';

/**
 * Below the desktop breakpoint the dashboard messenger fills the viewport:
 * page scroll is locked and the bottom nav hides while a chat is open.
 */
export function useMobileChatLayout({ isPanel, mobilePanel }) {
  const { setBottomNavHidden } = useLayoutChrome();

  useEffect(() => {
    if (isPanel) return undefined;

    const media = window.matchMedia(MOBILE_QUERY);

    const syncLayout = () => {
      const isMobile = media.matches;
      setBottomNavHidden(isMobile && mobilePanel === 'chat');
      document.documentElement.style.overflow = isMobile ? 'hidden' : '';
      document.body.style.overflow = isMobile ? 'hidden' : '';
    };

    syncLayout();
    media.addEventListener('change', syncLayout);

    return () => {
      media.removeEventListener('change', syncLayout);
      setBottomNavHidden(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [mobilePanel, setBottomNavHidden, isPanel]);
}
