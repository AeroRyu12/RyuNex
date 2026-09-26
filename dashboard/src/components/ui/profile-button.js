import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOut, faChevronDown, faCog } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../../lib/auth/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "../../socket";
function ProfileButton({ className = "", minimal = false }) {
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState({ status: "offline" });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await auth.getUser();
        setUser(userData);
        if (userData) {
          await fetchUserStatus();
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
    socket.on("presenceUpdate", (data) => {
      if (user && data.userId === user.id) {
        setUserStatus({ status: data.status });
      }
    });
    const statusInterval = setInterval(fetchUserStatus, 3e4);
    return () => {
      clearInterval(statusInterval);
      socket.off("presenceUpdate");
    };
  }, [user]);
  const fetchUserStatus = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${window.DASHBOARD_CONFIG?.API_URL}/auth/status`, {
        credentials: "include"
      });
      if (response.ok) {
        const status = await response.json();
        setUserStatus(status);
      }
    } catch (error) {
      console.error("Failed to fetch user status:", error);
    }
  };
  const handleLogout = async () => {
    await auth.logout();
    navigate("/auth/signin");
  };
  const getInitials = (displayName2) => {
    if (!displayName2) return "?";
    return displayName2.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (isLoading) {
    return minimal ? /* @__PURE__ */ jsxs("div", { className: `flex items-center space-x-3 animate-pulse ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-secondary" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 w-24 bg-secondary rounded" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: `flex items-center space-x-3 p-2 rounded-lg bg-secondary border border-border animate-pulse ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-muted" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 w-24 bg-muted rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-16 bg-muted rounded mt-1" })
      ] })
    ] });
  }
  if (!user) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => auth.login(),
        className: "flex items-center space-x-2 px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors duration-150",
        children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faUser, className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: "Sign In with Discord" })
        ]
      }
    );
  }
  const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;
  const displayName = user.global_name || user.username;
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-muted-foreground";
    }
  };
  const goToUserSettings = () => {
    navigate("/user-settings");
    setIsOpen(false);
  };
  if (minimal) {
    return /* @__PURE__ */ jsx("div", { className: `group transition-colors duration-150 ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: avatarUrl,
            alt: displayName,
            className: "w-8 h-8 rounded-full border border-border",
            onError: (e) => {
              e.target.onerror = null;
              e.target.src = `https://cdn.discordapp.com/embed/avatars/0.png`;
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(userStatus.status)} rounded-full border-2 border-background`
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 text-left min-w-0", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground truncate", children: displayName }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center space-x-3 px-3 py-2 bg-secondary rounded-lg border border-border transition-colors duration-150 hover:bg-muted",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(userStatus.status)} rounded-full border-2 border-background z-10`
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: avatarUrl,
                alt: "Profile",
                className: "w-8 h-8 rounded-lg border border-border",
                onError: (e) => {
                  e.target.onerror = null;
                  e.target.src = `https://cdn.discordapp.com/embed/avatars/0.png`;
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium text-sm", children: displayName }),
              /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-xs", children: [
                "@",
                user.username
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              FontAwesomeIcon,
              {
                icon: faChevronDown,
                className: `w-3 h-3 text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`
              }
            )
          ] })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-40",
          onClick: () => setIsOpen(false)
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg z-50 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-1.5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: goToUserSettings,
            className: "w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors duration-150",
            children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCog, className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "User Settings" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors duration-150",
            children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSignOut, className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Sign Out" })
            ]
          }
        )
      ] }) })
    ] })
  ] });
}
export {
  ProfileButton
};
