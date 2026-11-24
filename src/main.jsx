import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./store/registerSessionBridge";
import App from "./App";
import { AuthSessionBridge } from "@/modules/auth";
import { installPreloadErrorReload } from "@/shared/router/utils/chunkReload";
import "./index.css";

// After a deploy, reload once instead of failing on chunks from the old build.
installPreloadErrorReload();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthSessionBridge>
        <App />
      </AuthSessionBridge>
    </Provider>
  </StrictMode>,
);
