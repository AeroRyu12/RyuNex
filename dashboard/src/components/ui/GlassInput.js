import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const GlassInput = forwardRef(
  ({ icon, error, label, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      label && /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        icon && /* @__PURE__ */ jsx(
          FontAwesomeIcon,
          {
            icon,
            className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            className: `
              w-full h-10 rounded-lg text-foreground placeholder:text-muted-foreground/60
              glass-input
              ${icon ? "pl-10 pr-4" : "px-4"}
              ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}
              ${className}
            `,
            ...props
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: error })
    ] });
  }
);
GlassInput.displayName = "GlassInput";
const GlassTextarea = forwardRef(
  ({ error, label, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      label && /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          ref,
          className: `
            w-full rounded-lg text-foreground placeholder:text-muted-foreground/60
            glass-input p-3 resize-none
            ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}
            ${className}
          `,
          ...props
        }
      ),
      error && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: error })
    ] });
  }
);
GlassTextarea.displayName = "GlassTextarea";
var stdin_default = GlassInput;
export {
  GlassInput,
  GlassTextarea,
  stdin_default as default
};
