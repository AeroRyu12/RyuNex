import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthGuard } from "./components/auth/AuthGuard";
import { PermissionGuard } from "./components/auth/PermissionGuard";
import Layout from "./components/layout/Layout";
import IndexPage from "./pages";
import TicketsPage from "./pages/tickets";
import SettingsPage from "./pages/settings";
import UserSettingsPage from "./pages/user-settings";
import LoginPage from "./pages/auth/login";
import SignInPage from "./pages/auth/signin";
import CallbackPage from "./pages/auth/callback";
import AccessDeniedPage from "./pages/auth/access-denied";
import TranscriptPage from "./pages/tickets/TranscriptPage";
import EmbedBuilderPage from "./pages/embed-builder";
import SuggestionsPage from "./pages/suggestions";
import CustomCommandsPage from "./pages/custom-commands";
import { CommandPalette, useCommandPalette } from "./components/ui/CommandPalette";
import { ToastProvider, useToast, setToastInstance } from "./components/ui/Toast";
import { auth } from "./lib/auth/auth";
import axios from "axios";
import { AddonPage } from "./components/addons/AddonPageLoader";
import { addonService } from "./services/addonService";
function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState(null);
  const [addonConfig, setAddonConfig] = useState({ pages: [], navItems: [] });
  const commandPalette = useCommandPalette();
  useEffect(() => {
    async function init() {
      try {
        const [authResponse, addonsResponse] = await Promise.all([
          axios.get("/api/auth/config"),
          addonService.getConfig().catch(() => ({ pages: [], navItems: [] }))
        ]);
        setConfig(authResponse.data);
        setAddonConfig(addonsResponse);
      } catch (error) {
        console.error("[App] Failed to load config:", error);
      }
    }
    init();
  }, []);
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await auth.isAuthenticated();
      const isPublicRoute = location.pathname.includes("/auth/") || location.pathname === "/login";
      if (!isAuth && !isPublicRoute) {
        const returnUrl = location.pathname + location.search;
        navigate("/auth/signin", {
          replace: true,
          state: { returnUrl }
        });
      }
      setIsReady(true);
    }
    checkAuth();
  }, [navigate, location]);
  if (!isReady || !config) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex items-center justify-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "mesh-gradient-animated" }),
      /* @__PURE__ */ jsx("div", { className: "noise-overlay" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl border-2 border-primary border-t-transparent animate-spin shadow-glow" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "Loading..." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CommandPalette, { isOpen: commandPalette.isOpen, onClose: commandPalette.close }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(Routes, { location, children: [
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/auth/signin", element: /* @__PURE__ */ jsx(SignInPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/auth/callback", element: /* @__PURE__ */ jsx(CallbackPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/auth/access-denied", element: /* @__PURE__ */ jsx(AccessDeniedPage, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "*",
          element: /* @__PURE__ */ jsx(AuthGuard, { children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Routes, { children: [
            /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(IndexPage, {}) }),
            /* @__PURE__ */ jsx(Route, { path: "/tickets", element: /* @__PURE__ */ jsx(TicketsPage, {}) }),
            /* @__PURE__ */ jsx(Route, { path: "/tickets/:id/transcript", element: /* @__PURE__ */ jsx(TranscriptPage, {}) }),
            /* @__PURE__ */ jsx(Route, { path: "/user-settings", element: /* @__PURE__ */ jsx(UserSettingsPage, {}) }),
            /* @__PURE__ */ jsx(
              Route,
              {
                path: "/settings",
                element: /* @__PURE__ */ jsx(PermissionGuard, { requiredRoles: config.permissions.Dashboard.Settings, children: /* @__PURE__ */ jsx(SettingsPage, {}) })
              }
            ),
            /* @__PURE__ */ jsx(
              Route,
              {
                path: "/embed-builder",
                element: /* @__PURE__ */ jsx(PermissionGuard, { requiredRoles: config.permissions.Dashboard.Embed || config.permissions.Dashboard.Settings, children: /* @__PURE__ */ jsx(EmbedBuilderPage, {}) })
              }
            ),
            /* @__PURE__ */ jsx(
              Route,
              {
                path: "/suggestions",
                element: /* @__PURE__ */ jsx(PermissionGuard, { requiredRoles: config.permissions.Dashboard.Suggestions, children: /* @__PURE__ */ jsx(SuggestionsPage, {}) })
              }
            ),
            /* @__PURE__ */ jsx(
              Route,
              {
                path: "/custom-commands",
                element: /* @__PURE__ */ jsx(PermissionGuard, { requiredRoles: config.permissions.Dashboard.Settings, children: /* @__PURE__ */ jsx(CustomCommandsPage, {}) })
              }
            ),
            /* @__PURE__ */ jsx(Route, { path: "/addon/:addonName/*", element: /* @__PURE__ */ jsx(AddonPage, {}) })
          ] }) }) })
        }
      )
    ] }, location.pathname) })
  ] });
}
function ToastInitializer() {
  const toast = useToast();
  useEffect(() => {
    setToastInstance(toast);
  }, [toast]);
  return null;
}
function App() {
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    /* @__PURE__ */ jsx(ToastInitializer, {}),
    /* @__PURE__ */ jsx(Router, { children: /* @__PURE__ */ jsx(AppRoutes, {}) })
  ] });
}
export {
  App as default
};
