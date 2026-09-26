import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const variantClasses = {
  default: "glass-button text-foreground hover:text-foreground",
  primary: "glass-button-primary text-primary-foreground",
  ghost: "bg-transparent hover:bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50 transition-all duration-200",
  destructive: "glass-button bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30"
};
const sizeClasses = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5"
};
function GlassButton({
  variant = "default",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  glow = false,
  children,
  className = "",
  disabled,
  ...props
}) {
  const glowClass = glow && variant === "primary" ? "animate-glow-pulse" : "";
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `
        inline-flex items-center justify-center font-medium rounded-lg
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${glowClass}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `,
      disabled: disabled || loading,
      ...props,
      children: loading ? /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        icon && iconPosition === "left" && /* @__PURE__ */ jsx(FontAwesomeIcon, { icon, className: "w-4 h-4" }),
        children,
        icon && iconPosition === "right" && /* @__PURE__ */ jsx(FontAwesomeIcon, { icon, className: "w-4 h-4" })
      ] })
    }
  );
}
var stdin_default = GlassButton;
export {
  GlassButton,
  stdin_default as default
};
