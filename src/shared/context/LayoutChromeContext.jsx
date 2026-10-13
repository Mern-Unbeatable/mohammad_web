import { createContext, useContext, useMemo, useState } from 'react';

const LayoutChromeContext = createContext({
  bottomNavHidden: false,
  setBottomNavHidden: () => {},
});

export const LayoutChromeProvider = ({ children }) => {
  const [bottomNavHidden, setBottomNavHidden] = useState(false);

  const value = useMemo(
    () => ({ bottomNavHidden, setBottomNavHidden }),
    [bottomNavHidden]
  );

  return (
    <LayoutChromeContext.Provider value={value}>{children}</LayoutChromeContext.Provider>
  );
};

export const useLayoutChrome = () => useContext(LayoutChromeContext);
