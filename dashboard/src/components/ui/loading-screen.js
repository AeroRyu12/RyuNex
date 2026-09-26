import { jsx, jsxs } from "react/jsx-runtime";
function LoadingScreen() {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Loading..." })
  ] }) });
}
export {
  LoadingScreen
};
