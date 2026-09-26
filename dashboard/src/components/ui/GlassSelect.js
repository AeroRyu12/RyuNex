import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
const GlassSelect = forwardRef(
  ({ options, label, error, placeholder, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      label && /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            ref,
            className: `
              w-full h-10 rounded-lg text-foreground
              glass-input appearance-none pl-4 pr-10
              cursor-pointer
              ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}
              ${className}
            `,
            ...props,
            children: [
              placeholder && /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: placeholder }),
              options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          FontAwesomeIcon,
          {
            icon: faChevronDown,
            className: "absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: error })
    ] });
  }
);
GlassSelect.displayName = "GlassSelect";
var stdin_default = GlassSelect;
export {
  GlassSelect,
  stdin_default as default
};
