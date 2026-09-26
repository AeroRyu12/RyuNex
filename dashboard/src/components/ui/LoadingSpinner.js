import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
function LoadingSpinner({ size = "md", text }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-2",
    lg: "w-14 h-14 border-3"
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "flex flex-col items-center justify-center min-h-[200px] gap-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} rounded-2xl border-primary border-t-transparent animate-spin shadow-glow` }),
          /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${sizeClasses[size]} rounded-2xl border-primary/20 border-t-transparent animate-spin`, style: { animationDirection: "reverse", animationDuration: "1.5s" } })
        ] }),
        text && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: text })
      ]
    }
  );
}
export {
  LoadingSpinner as default
};
