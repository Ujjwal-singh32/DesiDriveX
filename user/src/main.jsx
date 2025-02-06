import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import UserContextProvier from "./context/UserContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvier>
      <App />
    </UserContextProvier>
  </BrowserRouter>
);
