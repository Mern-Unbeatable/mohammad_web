import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
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
      <Toaster
        position="bottom-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          duration: 4000,
          style: { fontSize: "14px", maxWidth: "420px" },
        }}
      />
    </Provider>
  </StrictMode>,
);
