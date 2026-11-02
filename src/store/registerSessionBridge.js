import { store } from "@/store/store";
import { router } from "@/shared/router/index.jsx";
import { resetAuth, tokenRefreshed } from "@/features/auth";
import { registerSessionBridge } from "@/config";

/**
 * Wires Redux + router into the axios session bridge (once at app boot).
 */
registerSessionBridge({
  onUnauthorized: () => {
    store.dispatch(resetAuth());
    const path = window.location.pathname;
    if (!path.startsWith("/login")) {
      router.navigate("/login", {
        replace: true,
        state: { from: path },
      });
    }
  },
  onTokenRefreshed: (accessToken) => {
    store.dispatch(tokenRefreshed(accessToken));
  },
});
