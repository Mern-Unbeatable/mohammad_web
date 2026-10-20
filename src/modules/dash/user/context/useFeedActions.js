import { createContext, useContext } from 'react';

export const FeedActionsContext = createContext({
  openCreatePost: () => {},
  registerOpenCreatePost: () => () => {},
});

export const useFeedActions = () => useContext(FeedActionsContext);
