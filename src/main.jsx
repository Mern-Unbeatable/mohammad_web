import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./api/registerSessionBridge";
import App from "./App";
import AuthSessionBridge from "./shared/auth/AuthSessionBridge";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthSessionBridge>
        <App />
      </AuthSessionBridge>
    </Provider>
  </StrictMode>,
);
