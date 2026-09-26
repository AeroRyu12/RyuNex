import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { addonService } from "../../services/addonService";
import { auth } from "../../lib/auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
function LoadingSpinner() {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl border-2 border-primary border-t-transparent animate-spin" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Loading addon page..." })
  ] }) });
}
function ErrorDisplay({ error, addonName }) {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxs("div", { className: "glass-card p-8 text-center max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-3xl", children: "\u26A0\uFE0F" }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground mb-2", children: "Failed to load addon page" }),
    /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-sm mb-4", children: [
      'The page from addon "',
      addonName,
      '" could not be loaded.'
    ] }),
    /* @__PURE__ */ jsx("code", { className: "block p-3 rounded-lg bg-secondary/50 text-xs text-red-400 overflow-auto", children: error })
  ] }) });
}
function AddonPageLoader({ addonName, pageName }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/addons/resolve/${addonName}/${pageName}`);
        if (!response.ok) {
          throw new Error(`Failed to resolve addon page: ${response.statusText}`);
        }
        const { modulePath } = await response.json();
        const module = await import(
          /* @vite-ignore */
          modulePath
        );
        setComponent(() => module.default || module);
      } catch (err) {
        console.error(`[AddonPageLoader] Failed to load ${addonName}/${pageName}:`, err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    loadComponent();
  }, [addonName, pageName]);
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingSpinner, {});
  }
  if (error) {
    return /* @__PURE__ */ jsx(ErrorDisplay, { error, addonName });
  }
  if (!Component) {
    return /* @__PURE__ */ jsx(ErrorDisplay, { error: "Component not found", addonName });
  }
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 },
      children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(LoadingSpinner, {}), children: /* @__PURE__ */ jsx(Component, {}) })
    }
  );
}
function AccessDenied() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6 glass-card p-6 lg:p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLock, className: "w-8 h-8 text-red-500" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Access Denied" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "You don't have permission to access this addon page. Please contact an administrator if you believe this is a mistake." })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => navigate(-1),
        className: "flex items-center justify-center gap-2 w-full glass-subtle hover:bg-secondary/50 text-foreground rounded-xl px-4 py-3 transition-colors",
        children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faArrowLeft, className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Go Back" })
        ]
      }
    )
  ] }) }) });
}
function AddonPage() {
  const { addonName, "*": pagePath } = useParams();
  const pageName = pagePath || "index";
  const [hasPermission, setHasPermission] = useState(null);
  const [pageConfig, setPageConfig] = useState(null);
  useEffect(() => {
    const checkPermissions = async () => {
      if (!addonName) return;
      try {
        const config = await addonService.getConfig();
        const fullPath = `/addon/${addonName}${pagePath ? `/${pagePath}` : ""}`;
        const page = config.pages.find(
          (p) => p.path === fullPath || p.path === `/addon/${addonName}` && !pagePath
        );
        setPageConfig(page || null);
        if (!page?.requiredRoles || page.requiredRoles.length === 0) {
          setHasPermission(true);
          return;
        }
        const user = await auth.getUser();
        if (!user || !user.roles) {
          setHasPermission(false);
          return;
        }
        const hasRole = user.roles.some((role) => page.requiredRoles.includes(role));
        setHasPermission(hasRole);
      } catch (error) {
        console.error("[AddonPage] Error checking permissions:", error);
        setHasPermission(true);
      }
    };
    checkPermissions();
  }, [addonName, pagePath]);
  if (!addonName) {
    return /* @__PURE__ */ jsx(ErrorDisplay, { error: "Addon name not specified", addonName: "unknown" });
  }
  if (hasPermission === null) {
    return /* @__PURE__ */ jsx(LoadingSpinner, {});
  }
  if (!hasPermission) {
    return /* @__PURE__ */ jsx(AccessDenied, {});
  }
  return /* @__PURE__ */ jsx(AddonPageLoader, { addonName, pageName });
}
var stdin_default = AddonPage;
export {
  AddonPage,
  AddonPageLoader,
  stdin_default as default
};
