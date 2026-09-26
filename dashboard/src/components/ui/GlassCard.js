import { jsx } from "react/jsx-runtime";
function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
  gradient = false,
  onClick
}) {
  const baseClasses = gradient ? "glass-card gradient-border" : "glass-card";
  const hoverClasses = hover ? "glass-card-hover cursor-pointer" : "";
  const glowClasses = glow ? "glow" : "";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${baseClasses} ${hoverClasses} ${glowClasses} ${className}`,
      onClick,
      children
    }
  );
}
function GlassCardHeader({ children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `px-5 py-4 border-b border-border/50 ${className}`, children });
}
function GlassCardContent({ children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `p-5 ${className}`, children });
}
function GlassCardFooter({ children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `px-5 py-4 border-t border-border/50 ${className}`, children });
}
var stdin_default = GlassCard;
export {
  GlassCard,
  GlassCardContent,
  GlassCardFooter,
  GlassCardHeader,
  stdin_default as default
};
