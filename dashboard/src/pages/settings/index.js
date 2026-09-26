import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faPalette, faServer, faChartBar, faReply, faSmile, faCompass, faCog, faBan } from "@fortawesome/free-solid-svg-icons";
import BotActivitySettings from "./modules/BotActivitySettings";
import DashboardSettings from "./modules/DashboardSettings";
import ThemeSettings from "./modules/ThemeSettings";
import AutoResponseSettings from "./modules/AutoResponseSettings";
import AutoReactSettings from "./modules/AutoReactSettings";
import NavigationSettings from "./modules/NavigationSettings";
import ChannelStatsSettings from "./modules/ChannelStatsSettings";
import BlacklistWordsSettings from "./modules/BlacklistWordsSettings";
const tabs = [
  { id: "bot", label: "Bot", icon: faRobot },
  { id: "dashboard", label: "Dashboard", icon: faPalette },
  { id: "server", label: "Server", icon: faServer }
];
const botSettings = [
  { id: "activity", label: "Bot Activity", icon: faRobot, component: BotActivitySettings },
  { id: "stats", label: "Channel Stats", icon: faChartBar, component: ChannelStatsSettings }
];
const dashboardSettings = [
  { id: "general", label: "General", icon: faCog, component: DashboardSettings },
  { id: "theme", label: "Theme", icon: faPalette, component: ThemeSettings },
  { id: "navigation", label: "Navigation", icon: faCompass, component: NavigationSettings }
];
const serverSettings = [
  { id: "autoresponse", label: "Auto Response", icon: faReply, component: AutoResponseSettings },
  { id: "autoreact", label: "Auto React", icon: faSmile, component: AutoReactSettings },
  { id: "blacklist", label: "Blacklist Words", icon: faBan, component: BlacklistWordsSettings }
];
function SettingsPage() {
  const [activeTab, setActiveTab] = useState("bot");
  const [expandedSections, setExpandedSections] = useState({});
  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const getCurrentSettings = () => {
    switch (activeTab) {
      case "bot":
        return botSettings;
      case "dashboard":
        return dashboardSettings;
      case "server":
        return serverSettings;
      default:
        return [];
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 lg:p-6 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "mb-6",
        children: /* @__PURE__ */ jsx("div", { className: "inline-flex p-1.5 glass-card rounded-2xl", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab(tab.id),
            className: `relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              activeTab === tab.id && /* @__PURE__ */ jsx(
                motion.div,
                {
                  layoutId: "activeTab",
                  className: "absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-glow",
                  transition: { type: "spring", stiffness: 300, damping: 30 }
                }
              ),
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: tab.icon, className: "w-4 h-4 relative z-10" }),
              /* @__PURE__ */ jsx("span", { className: "relative z-10", children: tab.label })
            ]
          },
          tab.id
        )) })
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.2 },
        className: "space-y-4",
        children: getCurrentSettings().map((setting, index) => {
          const isExpanded = expandedSections[setting.id] ?? false;
          const Component = setting.component;
          return /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.1 },
              className: "glass-card overflow-hidden",
              children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => toggleSection(setting.id),
                    className: "w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/20 transition-colors duration-200",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl bg-primary/10", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: setting.icon, className: "w-4 h-4 text-primary" }) }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: setting.label })
                      ] }),
                      /* @__PURE__ */ jsx(
                        motion.div,
                        {
                          animate: { rotate: isExpanded ? 180 : 0 },
                          transition: { duration: 0.2 },
                          children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(AnimatePresence, { children: isExpanded && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: "auto", opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.2 },
                    className: "overflow-hidden",
                    children: /* @__PURE__ */ jsx("div", { className: "px-5 pb-5 pt-2 border-t border-border/30", children: /* @__PURE__ */ jsx(Component, {}) })
                  }
                ) })
              ]
            },
            setting.id
          );
        })
      },
      activeTab
    ) })
  ] });
}
var stdin_default = SettingsPage;
export {
  stdin_default as default
};
