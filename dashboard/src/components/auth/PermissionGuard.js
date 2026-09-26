import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/auth/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
function PermissionGuard({ children, requiredRoles }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkPermission() {
      try {
        const user = await auth.getUser();
        if (!user || !user.roles) {
          setHasPermission(false);
          return;
        }
        const hasRequiredRole = user.roles.some((role) => requiredRoles.includes(role));
        setHasPermission(hasRequiredRole);
      } catch (error) {
        console.error("[PermissionGuard] Error checking permissions:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkPermission();
  }, [requiredRoles]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-[calc(100vh-4rem)]", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }) });
  }
  if (!hasPermission) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-[calc(100vh-4rem)]", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-[90%] sm:max-w-md px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6 bg-gray-800/50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700/50", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-red-500/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLock, className: "w-6 h-6 sm:w-8 sm:h-8 text-red-500" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl font-bold text-white", children: "Access Denied" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm sm:text-base text-gray-400", children: "You don't have permission to access this page. Please contact an administrator if you believe this is a mistake." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate(-1),
          className: "flex items-center justify-center space-x-2 w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 sm:py-3 transition-colors duration-200 text-sm sm:text-base",
          children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faArrowLeft, className: "w-3 h-3 sm:w-4 sm:h-4" }),
            /* @__PURE__ */ jsx("span", { children: "Go Back" })
          ]
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  PermissionGuard
};
