import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronRight, faBars, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { ticketService } from "../../services/ticketService";
import { userDataService } from "../../utils/userDataService";
import { auth } from "../../lib/auth/auth";
import { motion, AnimatePresence } from "framer-motion";
function SearchResultSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b border-border/30 last:border-0 animate-pulse", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-xl bg-secondary/50" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3.5 w-28 bg-secondary/50 rounded-lg" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-40 bg-secondary/50 rounded-lg" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-5 w-14 bg-secondary/50 rounded-full ml-3" })
  ] }) });
}
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeOut" }
};
function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.pathname === "/" ? "Overview" : location.pathname === "/embed-builder" ? "Embed Builder" : location.pathname === "/user-settings" ? "Settings" : location.pathname.split("/")[1].charAt(0).toUpperCase() + location.pathname.split("/")[1].slice(1);
  const [settings, setSettings] = useState({
    navName: "",
    favicon: "",
    tabName: ""
  });
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userDisplayData, setUserDisplayData] = useState({});
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings/dashboard");
        setSettings(response.data || { navName: "", favicon: "", tabName: "" });
        document.title = response.data?.tabName || "Dashboard";
        if (response.data?.favicon) {
          const favicon = document.querySelector("link[rel~='icon']");
          if (favicon) {
            favicon.href = response.data.favicon;
          } else {
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = response.data.favicon;
            document.head.appendChild(newFavicon);
          }
        }
      } catch (error) {
        console.error("[Layout] Failed to fetch dashboard settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await auth.getUser();
        setUserRoles(user?.roles || []);
        setUserId(user?.id || null);
      } catch (error) {
        console.error("Failed to load user data:", error);
        setUserRoles([]);
        setUserId(null);
      }
    };
    loadUserData();
  }, []);
  useEffect(() => {
    if (!isFocused) return;
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const { tickets } = await ticketService.getTickets({
          search: searchQuery.trim(),
          limit: 5
        });
        const filteredTickets = tickets.filter((ticket) => {
          if (ticket.creator === userId) return true;
          const ticketType = window.DASHBOARD_CONFIG?.TICKETS?.TYPES?.[ticket.type];
          if (!ticketType) return false;
          const supportRoles = Array.isArray(ticketType.supportRoles) ? ticketType.supportRoles : [ticketType.supportRoles];
          return supportRoles.some((roleId) => userRoles.includes(roleId));
        });
        setSearchResults(filteredTickets);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isFocused, userRoles, userId]);
  useEffect(() => {
    const loadUserData = async () => {
      if (!searchResults.length) return;
      setIsLoadingUserData(true);
      const uniqueUsers = Array.from(new Set(searchResults.map((ticket) => ticket.creator)));
      const initialData = {};
      try {
        for (const userId2 of uniqueUsers) {
          const data = await userDataService.getUserData(userId2);
          initialData[userId2] = { avatar: data.avatar, displayName: data.displayName };
        }
        setUserDisplayData(initialData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoadingUserData(false);
      }
    };
    loadUserData();
  }, [searchResults]);
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        pathname: "/tickets",
        search: `?status=all&priority=all&type=all&search=${encodeURIComponent(searchQuery.trim())}&sortBy=newest`
      });
      setSearchQuery("");
      setShowDropdown(false);
      setIsFocused(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex items-center justify-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "mesh-gradient" }),
      /* @__PURE__ */ jsx("div", { className: "noise-overlay" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl border-2 border-primary border-t-transparent animate-spin shadow-glow" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Loading..." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background relative", children: [
    /* @__PURE__ */ jsx("div", { className: "mesh-gradient-animated" }),
    /* @__PURE__ */ jsx("div", { className: "noise-overlay" }),
    isMobileMenuOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden",
        onClick: () => setIsMobileMenuOpen(false)
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-out z-50`, children: /* @__PURE__ */ jsx(
      Sidebar,
      {
        navName: settings.navName,
        onClose: () => setIsMobileMenuOpen(false),
        isMobileMenuOpen
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-screen lg:ml-64 relative z-10", children: [
      /* @__PURE__ */ jsx("header", { className: `sticky top-0 z-30 transition-all duration-300 ${scrolled ? "py-2 px-4 lg:px-6" : "py-3 px-4 lg:px-6"}`, children: /* @__PURE__ */ jsxs("div", { className: `glass-card transition-all duration-300 ${scrolled ? "shadow-glass-lg" : ""}`, children: [
        /* @__PURE__ */ jsx("div", { className: "h-14 px-4 lg:px-5", children: /* @__PURE__ */ jsxs("div", { className: "h-full flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsMobileMenuOpen(true),
                className: "lg:hidden p-2.5 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faBars, className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-base font-semibold text-foreground", children: title }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex flex-1 max-w-md", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "w-full relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  onFocus: () => {
                    setIsFocused(true);
                    setShowDropdown(true);
                  },
                  onBlur: () => {
                    setTimeout(() => {
                      setIsFocused(false);
                      setShowDropdown(false);
                    }, 200);
                  },
                  placeholder: "Search tickets...",
                  className: "w-full h-10 rounded-xl text-foreground placeholder-muted-foreground/50 px-4 pl-10 pr-20 text-sm glass-input"
                }
              ),
              /* @__PURE__ */ jsx(
                FontAwesomeIcon,
                {
                  icon: faSearch,
                  className: "absolute top-1/2 -translate-y-1/2 left-3.5 w-4 h-4 text-muted-foreground/50"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1 text-[10px] text-muted-foreground/40 font-mono", children: [
                /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30", children: "\u2318" }),
                /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30", children: "K" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(AnimatePresence, { children: showDropdown && /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, y: -10, scale: 0.98 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: -10, scale: 0.98 },
                transition: { duration: 0.15 },
                className: "absolute mt-2 w-full",
                children: /* @__PURE__ */ jsx("div", { className: "glass-card overflow-hidden", children: isSearching ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(SearchResultSkeleton, {}),
                  /* @__PURE__ */ jsx(SearchResultSkeleton, {}),
                  /* @__PURE__ */ jsx(SearchResultSkeleton, {})
                ] }) : /* @__PURE__ */ jsx(Fragment, { children: !searchQuery.trim() ? /* @__PURE__ */ jsxs("div", { className: "px-4 py-8 text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSearch, className: "w-4 h-4 text-muted-foreground/50" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Search for tickets" }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/50 text-xs mt-1", children: "Type to search by title or user" })
                ] }) : searchResults.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
                  searchResults.map((ticket, index) => {
                    const userData = userDisplayData[ticket.creator] || {
                      avatar: `https://cdn.discordapp.com/embed/avatars/0.png`,
                      displayName: "Loading..."
                    };
                    return /* @__PURE__ */ jsx(
                      motion.div,
                      {
                        initial: { opacity: 0, y: 5 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: index * 0.05 },
                        children: /* @__PURE__ */ jsxs(
                          Link,
                          {
                            to: `/tickets/${ticket.id}/transcript`,
                            className: "flex items-center justify-between px-4 py-3 hover:bg-secondary/30 border-b border-border/30 last:border-0 transition-all duration-200",
                            onClick: () => {
                              setSearchQuery("");
                              setShowDropdown(false);
                              setIsFocused(false);
                            },
                            children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                                /* @__PURE__ */ jsx(
                                  "img",
                                  {
                                    src: userData.avatar,
                                    alt: "",
                                    className: `w-8 h-8 rounded-xl ${isLoadingUserData ? "opacity-50" : ""}`
                                  }
                                ),
                                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: ticket.title }),
                                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: userData.displayName })
                                ] })
                              ] }),
                              /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 text-[11px] rounded-full font-medium ml-3 ${ticket.status === "open" ? "bg-emerald-500/15 text-emerald-400 status-glow-open" : ticket.status === "closed" ? "bg-zinc-500/15 text-zinc-400" : "bg-amber-500/15 text-amber-400 status-glow-pending"}`, children: ticket.status })
                            ]
                          }
                        )
                      },
                      ticket.id
                    );
                  }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleSearch,
                      className: "w-full px-4 py-3 text-xs text-primary hover:bg-secondary/30 flex items-center justify-center gap-2 font-medium transition-all duration-200 border-t border-border/30",
                      children: [
                        "View all results",
                        /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronRight, className: "w-2.5 h-2.5" })
                      ]
                    }
                  )
                ] }) : /* @__PURE__ */ jsxs("div", { className: "px-4 py-8 text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "No results found" }),
                  /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/50 text-xs mt-1", children: "Try a different search term" })
                ] }) }) })
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200",
              onClick: () => setShowMobileSearch(!showMobileSearch),
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSearch, className: "w-4 h-4" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: showMobileSearch && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            className: "md:hidden overflow-hidden",
            children: /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: "Search tickets...",
                  className: "w-full h-10 rounded-xl text-foreground placeholder-muted-foreground/50 px-4 pl-10 text-sm glass-input"
                }
              ),
              /* @__PURE__ */ jsx(
                FontAwesomeIcon,
                {
                  icon: faSearch,
                  className: "absolute top-1/2 -translate-y-1/2 left-3.5 w-4 h-4 text-muted-foreground/50"
                }
              )
            ] }) }) })
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 py-4", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: pageTransition.initial,
          animate: pageTransition.animate,
          exit: pageTransition.exit,
          transition: pageTransition.transition,
          children
        },
        location.pathname
      ) })
    ] })
  ] });
}
var stdin_default = Layout;
export {
  stdin_default as default
};
