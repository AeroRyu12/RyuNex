import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faCheck, faUndo } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { toast } from "../components/ui/Toast";
import { useTheme } from "../contexts/ThemeContext";
function UserSettingsPage() {
  const { theme, setTheme, themes, defaultTheme, isUsingDefault } = useTheme();
  const [loading, setLoading] = useState(false);
  const handleThemeChange = async (selectedTheme) => {
    setLoading(true);
    try {
      setTheme(selectedTheme);
      toast.success("Theme updated successfully");
    } catch (error) {
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };
  const resetToDefault = () => {
    setTheme(defaultTheme);
    toast.success("Reset to default theme");
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 lg:p-6 max-w-[1200px] mx-auto", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center gap-4 mb-8",
        children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-glow", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPalette, className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-foreground", children: "User Settings" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Customize your dashboard experience" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "glass-card p-6",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground mb-1", children: "Theme Preference" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Choose your preferred color scheme. This will override the default theme." })
            ] }),
            !isUsingDefault && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: resetToDefault,
                className: "flex items-center gap-2 px-4 py-2.5 glass-button rounded-xl text-sm font-medium",
                children: [
                  /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faUndo, className: "w-3 h-3" }),
                  "Reset to Default"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-6 p-5 glass-subtle rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: themes.find((t) => t.value === theme) && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-8 h-8 rounded-xl border-2 border-border/50 shadow-lg",
                  style: { backgroundColor: themes.find((t) => t.value === theme)?.colors.primary }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-8 h-8 rounded-xl border-2 border-border/50",
                  style: { backgroundColor: themes.find((t) => t.value === theme)?.colors.secondary }
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-foreground", children: [
                "Current: ",
                themes.find((t) => t.value === theme)?.label
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: isUsingDefault ? `Using default theme (${themes.find((t) => t.value === defaultTheme)?.label})` : "Using custom theme preference" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: themes.map((themeOption, index) => /* @__PURE__ */ jsxs(
            motion.button,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 + index * 0.05 },
              onClick: () => handleThemeChange(themeOption.value),
              disabled: loading,
              className: `group p-5 rounded-xl transition-all duration-300 text-left ${theme === themeOption.value ? "glass-card border-primary/50 shadow-glow-sm" : "glass-card-hover"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-6 h-6 rounded-lg border border-border/50 transition-transform duration-300 group-hover:scale-110",
                        style: { backgroundColor: themeOption.colors.primary }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-6 h-6 rounded-lg border border-border/50 transition-transform duration-300 group-hover:scale-110",
                        style: { backgroundColor: themeOption.colors.secondary }
                      }
                    )
                  ] }),
                  theme === themeOption.value && /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      className: "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center",
                      children: /* @__PURE__ */ jsx(
                        FontAwesomeIcon,
                        {
                          icon: faCheck,
                          className: "w-3 h-3 text-primary"
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm mb-1", children: themeOption.label }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
                    themeOption.value === "dark" && "Classic dark theme with blue accents",
                    themeOption.value === "blue" && "Ocean-inspired deep blue theme",
                    themeOption.value === "purple" && "Rich purple theme",
                    themeOption.value === "green" && "Natural green theme",
                    themeOption.value === "orange" && "Warm sunset orange theme",
                    themeOption.value === "teal" && "Cool ocean teal theme",
                    themeOption.value === "cyberpunk" && "Futuristic neon pink theme",
                    themeOption.value === "sunset" && "Golden warm sunset theme",
                    themeOption.value === "corporate" && "Professional navy blue theme"
                  ] }),
                  themeOption.value === defaultTheme && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/15 text-primary", children: "Default" }) })
                ] })
              ]
            },
            themeOption.value
          )) }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.5 },
              className: "mt-6 p-5 glass-subtle rounded-xl",
              children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm mb-3", children: "About Theme Settings" }),
                /* @__PURE__ */ jsxs("ul", { className: "text-xs text-muted-foreground space-y-2", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
                    "Your theme preference is saved to your browser"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
                    "You can reset to the system default theme at any time"
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
                    "Theme changes are applied instantly"
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
var stdin_default = UserSettingsPage;
export {
  stdin_default as default
};
