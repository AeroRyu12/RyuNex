import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "../../../components/ui/Toast";
import { useTheme } from "../../../contexts/ThemeContext";
function ThemeSettings() {
  const [loadingTheme, setLoadingTheme] = useState(null);
  const { themes, defaultTheme, setDefaultTheme } = useTheme();
  const handleSave = async (selectedTheme) => {
    if (selectedTheme === defaultTheme) return;
    setLoadingTheme(selectedTheme);
    try {
      await setDefaultTheme(selectedTheme);
      toast.success("Default theme updated successfully");
    } catch (error) {
      console.error("Theme update error:", error);
      toast.error("Failed to update default theme");
    } finally {
      setLoadingTheme(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-1", children: "Default Theme" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Select the default theme for all users when they first visit the dashboard." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: themes.map((theme) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => handleSave(theme.value),
        disabled: loadingTheme === theme.value,
        className: `p-4 rounded-lg border transition-colors text-left ${defaultTheme === theme.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card hover:bg-secondary/50"} ${loadingTheme ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-1.5", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-4 h-4 rounded-full border border-border",
                  style: { backgroundColor: theme.colors.primary }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-4 h-4 rounded-full border border-border",
                  style: { backgroundColor: theme.colors.secondary }
                }
              )
            ] }),
            defaultTheme === theme.value && !loadingTheme && /* @__PURE__ */ jsx(
              FontAwesomeIcon,
              {
                icon: faCheck,
                className: "w-3 h-3 text-primary"
              }
            ),
            loadingTheme === theme.value && /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm text-foreground", children: theme.label }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              theme.value === "dark" && "Classic dark theme",
              theme.value === "blue" && "Ocean-inspired blue theme",
              theme.value === "purple" && "Rich purple theme",
              theme.value === "green" && "Natural green theme",
              theme.value === "orange" && "Warm sunset orange theme",
              theme.value === "teal" && "Cool ocean teal theme",
              theme.value === "cyberpunk" && "Futuristic cyberpunk theme",
              theme.value === "sunset" && "Golden sunset theme",
              theme.value === "corporate" && "Professional corporate theme"
            ] })
          ] })
        ]
      },
      theme.value
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 p-4 bg-secondary rounded-lg", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm text-foreground mb-2", children: "How it works" }),
      /* @__PURE__ */ jsxs("ul", { className: "text-xs text-muted-foreground space-y-1", children: [
        /* @__PURE__ */ jsx("li", { children: "\u2022 New users will see the default theme when they first visit" }),
        /* @__PURE__ */ jsx("li", { children: "\u2022 Users can override the default in their personal settings" }),
        /* @__PURE__ */ jsx("li", { children: "\u2022 Existing users with custom themes won't be affected" })
      ] })
    ] })
  ] });
}
var stdin_default = ThemeSettings;
export {
  stdin_default as default
};
