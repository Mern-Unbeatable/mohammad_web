import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bootstrapSession } from "@/features/auth";
import AppBootLoadingScreen from "@/components/loader/screens/AppBootLoadingScreen";

/**
 * Bootstraps auth on load. Access/refresh tokens are httpOnly cookies the
 * browser sends automatically but JS cannot read, so we attempt a silent
 * cookie-based refresh + profile fetch. A logged-out visitor is simply marked
 * ready (no redirect), so public pages still render.
 */
const AuthSessionBridge = ({ children }) => {
  const dispatch = useDispatch();
  const sessionReady = useSelector((state) => state.auth.sessionReady);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    dispatch(bootstrapSession());
  }, [dispatch]);

  if (!sessionReady) {
    return <AppBootLoadingScreen />;
  }

  return children;
};

export default AuthSessionBridge;
