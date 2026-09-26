import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import EmbedBuilder from "./components/EmbedBuilder";
import ComponentsV2Builder from "./components/ComponentsV2Builder";
const EmbedBuilderPage = () => {
  const [activeTab, setActiveTab] = useState("classic");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 px-4 lg:px-6 max-w-[1600px] mx-auto w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-1.5 inline-flex gap-1", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("classic"),
          className: `relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "classic" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            activeTab === "classic" && /* @__PURE__ */ jsx(
              motion.div,
              {
                layoutId: "activeTab",
                className: "absolute inset-0 bg-primary/20 rounded-xl",
                transition: { type: "spring", duration: 0.3 }
              }
            ),
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCode, className: "w-4 h-4 relative z-10" }),
            /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Classic Embed" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("v2"),
          className: `relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "v2" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            activeTab === "v2" && /* @__PURE__ */ jsx(
              motion.div,
              {
                layoutId: "activeTab",
                className: "absolute inset-0 bg-primary/20 rounded-xl",
                transition: { type: "spring", duration: 0.3 }
              }
            ),
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLayerGroup, className: "w-4 h-4 relative z-10" }),
            /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Components V2" }),
            /* @__PURE__ */ jsx("span", { className: "relative z-10 px-1.5 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded", children: "NEW" })
          ]
        }
      )
    ] }),
    activeTab === "classic" ? /* @__PURE__ */ jsx(EmbedBuilder, {}) : /* @__PURE__ */ jsx(ComponentsV2Builder, {})
  ] });
};
var stdin_default = EmbedBuilderPage;
export {
  stdin_default as default
};
