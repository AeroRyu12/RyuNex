import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
function ExampleSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to the server!");
  return /* @__PURE__ */ jsx("div", { className: "px-4 lg:px-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "glass-card p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-foreground mb-6", children: "Example Addon Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 glass-subtle rounded-xl", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground", children: "Enable Addon" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Toggle the addon on or off" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setEnabled(!enabled),
            className: `relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-secondary"}`,
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: `absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "left-7" : "left-1"}`
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 glass-subtle rounded-xl", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Welcome Message" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "The message to send when a new member joins" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: welcomeMessage,
            onChange: (e) => setWelcomeMessage(e.target.value),
            className: "w-full h-10 px-4 rounded-xl glass-input text-sm",
            placeholder: "Enter welcome message..."
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("button", { className: "px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors", children: "Save Settings" }) })
    ] })
  ] }) });
}
export {
  ExampleSettingsPage as default
};
