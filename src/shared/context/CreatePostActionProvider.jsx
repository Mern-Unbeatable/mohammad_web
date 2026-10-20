import { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CreatePostActionContext } from './useCreatePostAction';

/**
 * Lets shell controls (e.g. the mobile "Post" tab) open the page-owned
 * create-post dialog. When no page has registered an opener it navigates to
 * `composerPath` and opens the dialog once that page registers.
 */
export const CreatePostActionProvider = ({ composerPath, children }) => {
  const navigate = useNavigate();
  const handlerRef = useRef(null);
  const openWhenRegistered = useRef(false);

  const openCreatePost = useCallback(() => {
    if (handlerRef.current) {
      handlerRef.current();
      return;
    }
    openWhenRegistered.current = true;
    navigate(composerPath);
  }, [navigate, composerPath]);

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

  const value = useMemo(
    () => ({ openCreatePost, registerOpenCreatePost }),
    [openCreatePost, registerOpenCreatePost]
  );

  return (
    <CreatePostActionContext.Provider value={value}>{children}</CreatePostActionContext.Provider>
  );
};
