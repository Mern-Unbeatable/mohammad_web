import { RouterProvider } from "react-router/dom";
import { router } from "./app/router/index.jsx";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
