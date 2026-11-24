import { useMemo, useState } from 'react';
import { LayoutChromeContext } from './useLayoutChrome';

/** Lets pages hide dashboard chrome (the mobile bottom nav) while they need the full viewport. */
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
