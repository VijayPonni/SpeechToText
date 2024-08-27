import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./package-with-polyfill";
import App from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <App />
  </StrictMode>
);
