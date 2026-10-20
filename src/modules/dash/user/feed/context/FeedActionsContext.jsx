import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { FeedActionsContext } from '../hooks/useFeedActions';

const FEED_PATH = '/feed';

/**
 * Lets shell controls (e.g. the mobile "Post" tab) open the feed's create-post
 * dialog. Away from the feed it navigates there and opens the dialog once the
 * feed registers its opener.
 */
export const FeedActionsProvider = ({ children }) => {
  const navigate = useNavigate();
  const handlerRef = useRef(null);
  const openWhenRegistered = useRef(false);

  const openCreatePost = useCallback(() => {
    if (handlerRef.current) {
      handlerRef.current();
      return;
    }
    openWhenRegistered.current = true;
    navigate(FEED_PATH);
  }, [navigate]);

  /** Returns an unregister function for effect cleanup. */
  const registerOpenCreatePost = useCallback((handler) => {
    handlerRef.current = handler;
    if (openWhenRegistered.current) {
      openWhenRegistered.current = false;
      handler();
    }
    return () => {
      if (handlerRef.current === handler) handlerRef.current = null;
    };
  }, []);

  return (
    <FeedActionsContext.Provider value={{ openCreatePost, registerOpenCreatePost }}>
      {children}
    </FeedActionsContext.Provider>
  );
};
