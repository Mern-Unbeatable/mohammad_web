import { createContext, useCallback, useContext, useRef } from 'react';

const FeedActionsContext = createContext({
  openCreatePost: () => {},
  registerOpenCreatePost: () => {},
});

export const FeedActionsProvider = ({ children }) => {
  const handlerRef = useRef(() => {});

  const openCreatePost = useCallback(() => {
    handlerRef.current();
  }, []);

  const registerOpenCreatePost = useCallback((handler) => {
    handlerRef.current = handler;
  }, []);

  return (
    <FeedActionsContext.Provider value={{ openCreatePost, registerOpenCreatePost }}>
      {children}
    </FeedActionsContext.Provider>
  );
};

export const useFeedActions = () => useContext(FeedActionsContext);
