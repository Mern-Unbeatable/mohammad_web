import { createContext, useContext } from 'react';

export const CreatePostActionContext = createContext({
  openCreatePost: () => {},
  registerOpenCreatePost: () => () => {},
});

export const useCreatePostAction = () => useContext(CreatePostActionContext);
