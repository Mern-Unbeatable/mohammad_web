import { RouterProvider } from "react-router/dom";
import { router } from "@/shared/router/index.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          duration: 4000,
          style: { fontSize: "14px", maxWidth: "420px" },
        }}
      />
    </>
  );
}

export default App;
