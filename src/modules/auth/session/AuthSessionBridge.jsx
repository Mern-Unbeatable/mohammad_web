import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, setSessionReady } from "@/features/auth";
import { tokenService } from "@/config";
import AppBootLoadingScreen from "@/components/ui/AppBootLoadingScreen";

/**
 * Bootstraps auth when a token cookie exists: revalidates via /auth/me.
 * Mount under Redux Provider (outside or inside the router).
 */
const AuthSessionBridge = ({ children }) => {
  const dispatch = useDispatch();
  const sessionReady = useSelector((state) => state.auth.sessionReady);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const token = tokenService.getToken();
    if (!token) {
      dispatch(setSessionReady(true));
      return;
    }

    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (!sessionReady) {
    return <AppBootLoadingScreen />;
  }

  return children;
};

export default AuthSessionBridge;
