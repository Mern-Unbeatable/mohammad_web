import { createContext, useContext } from 'react';

export const LayoutChromeContext = createContext({
  bottomNavHidden: false,
  setBottomNavHidden: () => {},
});

export const useLayoutChrome = () => useContext(LayoutChromeContext);
