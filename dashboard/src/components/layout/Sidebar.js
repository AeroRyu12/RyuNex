import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCog,
  faExternalLinkAlt,
  faBars,
  faXmark,
  faCode,
  faTicket,
  faComments,
  faSignOutAlt,
  faChevronLeft,
  faChevronRight,
  faTerminal
} from "@fortawesome/free-solid-svg-icons";
import api from "../../lib/api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../socket";
import { auth } from "../../lib/auth/auth";
const defaultNavigationItems = [
  { name: "Overview", href: "/", icon: faHome, permission: "Login" },
  { name: "Support", href: "/tickets", icon: faTicket, permission: "Login" },
  { name: "Builder", href: "/embed-builder", icon: faCode, permission: "Embed" },
  { name: "Commands", href: "/custom-commands", icon: faTerminal, permission: "Settings" },
  { name: "Suggestions", href: "/suggestions", icon: faComments, permission: "Suggestions" },
  { name: "Settings", href: "/settings", icon: faCog, permission: "Settings" }
];
function Sidebar({ navName = "", onClose }) {
  const location = useLocation();
  const [customItems, setCustomItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const [user, setUser] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeout = useRef(null);
  const [addonNavItems, setAddonNavItems] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [configRes, userRes, dashRes, addonsRes] = await Promise.all([
          api.get("/auth/config"),
          api.get("/auth/me"),
          api.get("/settings/dashboard"),
          api.get("/addons/config").catch(() => ({ data: { navItems: [] } }))
        ]);
        setPermissions(configRes.data.permissions.Dashboard);
        setUser(userRes.data.user);
        if (dashRes.data?.customNavItems) {
          setCustomItems(dashRes.data.customNavItems);
        }
        if (addonsRes.data?.navItems) {
          setAddonNavItems(addonsRes.data.navItems);
        }
      } catch (e) {
        console.error("Failed to load sidebar data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  useEffect(() => {
    const handleSettingsUpdate = (data) => {
      if (data?.customNavItems) setCustomItems(data.customNavItems);
    };
    socket.on("settings:update", handleSettingsUpdate);
    return () => socket.off("settings:update", handleSettingsUpdate);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      if (mobile) setIsCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    return () => hoverTimeout.current && clearTimeout(hoverTimeout.current);
  }, []);
  const hasPermission = (perm, requiredRoles = null) => {
    if (!user?.roles) return false;
    if (requiredRoles && requiredRoles.length > 0) {
      return requiredRoles.some((r) => user.roles.includes(r) || user.roles.some((role) => role.id === r));
    }
    if (!perm) return true;
    if (!permissions) return false;
    if (perm === "Login") {
      return permissions.Login?.some((r) => user.roles.includes(r) || user.roles.some((role) => role.id === r));
    }
    return (permissions[perm] || []).some((r) => user.roles.includes(r) || user.roles.some((role) => role.id === r));
  };
  const handleHover = (id) => {
    hoverTimeout.current && clearTimeout(hoverTimeout.current);
    setHoveredItem(id);
  };
  const handleHoverEnd = () => {
    hoverTimeout.current = setTimeout(() => setHoveredItem(null), 150);
  };
  const NavItem = ({ item, index }) => {
    if (!hasPermission(item.permission, item.requiredRoles)) return null;
    const isActive = location.pathname === item.href;
    const isExternal = item.href?.startsWith("http");
    const showTooltip = isCollapsed && hoveredItem === index;
    const itemContent = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: `relative z-10 flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/20 text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:bg-secondary/50"}`, children: item.emoji ? /* @__PURE__ */ jsx("span", { className: "text-sm", children: item.emoji }) : /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: item.icon, className: "w-[18px] h-[18px]" }) }),
      !isCollapsed && /* @__PURE__ */ jsx("span", { className: `flex-1 text-[13px] font-medium transition-all duration-300 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`, children: item.name }),
      !isCollapsed && isExternal && /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faExternalLinkAlt, className: "w-3 h-3 text-muted-foreground/40" })
    ] });
    const classes = `group relative flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10 active-indicator" : "hover:bg-secondary/40"}`;
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      isExternal ? /* @__PURE__ */ jsx(
        "a",
        {
          href: item.href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: classes,
          onMouseEnter: () => isCollapsed && handleHover(index),
          onMouseLeave: handleHoverEnd,
          children: itemContent
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: item.href,
          className: classes,
          onClick: () => isMobile && onClose?.(),
          onMouseEnter: () => isCollapsed && handleHover(index),
          onMouseLeave: handleHoverEnd,
          children: itemContent
        }
      ),
      /* @__PURE__ */ jsx(AnimatePresence, { children: showTooltip && /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -5 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -5 },
          transition: { duration: 0.15 },
          className: "absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 glass-card text-xs font-medium z-50 whitespace-nowrap",
          children: item.name
        }
      ) })
    ] });
  };
  const sidebarWidth = isCollapsed ? "w-[72px]" : "w-64";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: (isSidebarOpen || !isMobile) && /* @__PURE__ */ jsxs(
      motion.aside,
      {
        initial: isMobile ? { x: "-100%" } : false,
        animate: { x: 0 },
        exit: { x: "-100%" },
        transition: { type: "spring", stiffness: 300, damping: 30 },
        className: `h-screen flex flex-col ${sidebarWidth} z-40 glass-sidebar transition-[width] duration-300`,
        children: [
          /* @__PURE__ */ jsx("div", { className: `flex items-center h-16 px-4 border-b border-border/30 ${isCollapsed ? "justify-center" : "justify-between"}`, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 ${isCollapsed ? "" : "flex-1"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-secondary/50 animate-pulse" }),
            !isCollapsed && /* @__PURE__ */ jsx("div", { className: "h-4 w-24 bg-secondary/50 rounded-lg animate-pulse" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 min-w-0 ${isCollapsed ? "" : "flex-1"}`, children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0", children: navName?.charAt(0)?.toUpperCase() || "D" }),
              !isCollapsed && /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: navName || "Dashboard" })
            ] }),
            !isCollapsed && !isMobile && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsCollapsed(true),
                className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronLeft, className: "w-3 h-3" })
              }
            ),
            isCollapsed && !isMobile && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsCollapsed(false),
                className: "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 shadow-lg",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronRight, className: "w-2.5 h-2.5" })
              }
            ),
            isMobile && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsSidebarOpen(false),
                className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faXmark, className: "w-4 h-4" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto py-4", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-2 px-2", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-secondary/30 animate-pulse" }),
            !isCollapsed && /* @__PURE__ */ jsx("div", { className: "h-4 w-24 bg-secondary/30 rounded-lg animate-pulse" })
          ] }, i)) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-1", children: defaultNavigationItems.map((item, i) => /* @__PURE__ */ jsx(NavItem, { item, index: i }, item.href)) }),
            addonNavItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "mx-4 my-4 border-t border-border/30" }),
              !isCollapsed && /* @__PURE__ */ jsx("div", { className: "px-4 pb-2", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider", children: "Addons" }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: addonNavItems.map((item, i) => /* @__PURE__ */ jsx(
                NavItem,
                {
                  item: {
                    ...item,
                    href: item.path,
                    emoji: item.emoji || "\u{1F4E6}"
                  },
                  index: `addon-${i}`
                },
                item.path
              )) })
            ] }),
            customItems.length > 0 && !isCollapsed && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "mx-4 my-4 border-t border-border/30" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: customItems.map((item, i) => /* @__PURE__ */ jsx(
                NavItem,
                {
                  item: { ...item, emoji: item.emoji || "\u{1F517}" },
                  index: `custom-${i}`
                },
                item.href
              )) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-border/30 p-3", children: [
            user && !isCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-3 mb-2 glass-subtle rounded-xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: user.avatar?.startsWith("https://") ? user.avatar : user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}?size=64` : `https://cdn.discordapp.com/embed/avatars/0.png`,
                    alt: "",
                    className: "w-9 h-9 rounded-xl ring-2 ring-primary/20",
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                    }
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: user.displayName || user.username || "User" }),
                user.username && user.displayName && user.username.toLowerCase() !== user.displayName.toLowerCase() && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground truncate", children: [
                  "@",
                  user.username
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `flex ${isCollapsed ? "flex-col items-center gap-2" : "items-center gap-2"}`, children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/user-settings",
                  onClick: () => isMobile && onClose?.(),
                  onMouseEnter: () => isCollapsed && handleHover("settings"),
                  onMouseLeave: handleHoverEnd,
                  className: `relative flex items-center justify-center ${isCollapsed ? "w-10 h-10" : "flex-1 gap-2 px-4 py-2.5"} rounded-xl glass-button text-muted-foreground hover:text-foreground`,
                  children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCog, className: "w-4 h-4" }),
                    !isCollapsed && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Settings" }),
                    /* @__PURE__ */ jsx(AnimatePresence, { children: isCollapsed && hoveredItem === "settings" && /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -5 },
                        animate: { opacity: 1, x: 0 },
                        exit: { opacity: 0, x: -5 },
                        transition: { duration: 0.15 },
                        className: "absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 glass-card text-xs font-medium z-50 whitespace-nowrap",
                        children: "Settings"
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    auth.logout();
                    isMobile && onClose?.();
                  },
                  onMouseEnter: () => isCollapsed && handleHover("logout"),
                  onMouseLeave: handleHoverEnd,
                  className: `relative flex items-center justify-center ${isCollapsed ? "w-10 h-10" : "gap-2 px-4 py-2.5"} rounded-xl glass-button text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30`,
                  children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSignOutAlt, className: "w-4 h-4" }),
                    !isCollapsed && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Logout" }),
                    /* @__PURE__ */ jsx(AnimatePresence, { children: isCollapsed && hoveredItem === "logout" && /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -5 },
                        animate: { opacity: 1, x: 0 },
                        exit: { opacity: 0, x: -5 },
                        transition: { duration: 0.15 },
                        className: "absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 glass-card text-xs font-medium z-50 whitespace-nowrap",
                        children: "Logout"
                      }
                    ) })
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: !isSidebarOpen && isMobile && /* @__PURE__ */ jsx(
      motion.button,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        onClick: () => setIsSidebarOpen(true),
        className: "fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center rounded-xl glass-card text-muted-foreground hover:text-foreground transition-colors lg:hidden",
        children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faBars, className: "w-5 h-5" })
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: () => setIsSidebarOpen(false),
        className: "fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
      }
    ) })
  ] });
}
export {
  Sidebar as default
};
