import { jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.removeAttribute("aria-hidden");
}
ReactDOM.createRoot(rootElement).render(
  /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(App, {}) }) })
);
