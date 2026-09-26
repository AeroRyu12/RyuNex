import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../contexts/ThemeContext";
function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200 border border-border hover:border-border/80",
        title: "Change theme",
        children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPalette, className: "w-5 h-5" })
      }
    ),
    isOpen && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-full mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl shadow-black/10 overflow-hidden z-50", children: /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
      /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border", children: "Color Scheme" }),
      themes.map((themeOption) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setTheme(themeOption.value);
            setIsOpen(false);
          },
          className: "w-full px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors duration-200 flex items-center justify-between group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-1", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full border border-border",
                    style: { backgroundColor: themeOption.colors.primary }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full border border-border",
                    style: { backgroundColor: themeOption.colors.secondary }
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground group-hover:text-foreground", children: themeOption.label })
            ] }),
            theme === themeOption.value && /* @__PURE__ */ jsx(
              FontAwesomeIcon,
              {
                icon: faCheck,
                className: "w-3.5 h-3.5 text-primary"
              }
            )
          ]
        },
        themeOption.value
      ))
    ] }) })
  ] });
}
export {
  ThemeSwitcher
};
