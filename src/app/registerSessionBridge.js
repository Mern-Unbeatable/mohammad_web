import { store } from "@/app/store";
import { router } from "@/app/router/index.jsx";
import { resetAuth, tokenRefreshed } from "@/features/auth";
import { registerSessionBridge } from "@/api/sessionBridge";

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
