import { useCallback, useMemo, useRef, useState } from 'react';
import { CreatePostActionContext } from './useCreatePostAction';

/**
 * Lets shell controls (e.g. the mobile "Post" tab) open the create-post dialog.
 * A page that owns its own dialog (the feed) registers an opener; on every
 * other page `renderFallback({ onClose })` is shown in place, so the dialog
 * opens without leaving the current page.
 */
export const CreatePostActionProvider = ({ renderFallback, children }) => {
  const handlerRef = useRef(null);
  const [fallbackOpen, setFallbackOpen] = useState(false);

  const openCreatePost = useCallback(() => {
    if (handlerRef.current) handlerRef.current();
    else setFallbackOpen(true);
  }, []);

  const closeFallback = useCallback(() => setFallbackOpen(false), []);

  /** Returns an unregister function for effect cleanup. */
  const registerOpenCreatePost = useCallback((handler) => {
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current === handler) handlerRef.current = null;
    };
  }, []);

  const value = useMemo(
    () => ({ openCreatePost, registerOpenCreatePost }),
    [openCreatePost, registerOpenCreatePost]
  );

  return (
    <CreatePostActionContext.Provider value={value}>
      {children}
      {fallbackOpen && renderFallback ? renderFallback({ onClose: closeFallback }) : null}
    </CreatePostActionContext.Provider>
  );
};
