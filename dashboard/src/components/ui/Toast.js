import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faExclamationTriangle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
const ToastContext = createContext(null);
let toastId = 0;
const icons = {
  success: faCheck,
  error: faXmark,
  warning: faExclamationTriangle,
  info: faInfoCircle
};
const colors = {
  success: "bg-green-500/90 border-green-400",
  error: "bg-red-500/90 border-red-400",
  warning: "bg-yellow-500/90 border-yellow-400",
  info: "bg-blue-500/90 border-blue-400"
};
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type, duration = 3e3) => {
    const id = ++toastId;
    setToasts((prev) => [...prev.slice(-4), { id, message, type, duration }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const toast2 = {
    success: (message, options) => addToast(message, "success", options?.duration ?? 3e3),
    error: (message, options) => addToast(message, "error", options?.duration ?? 4e3),
    warning: (message, options) => addToast(message, "warning", options?.duration ?? 3500),
    info: (message, options) => addToast(message, "info", options?.duration ?? 3e3)
  };
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: toast2, children: [
    children,
    /* @__PURE__ */ jsx("div", { className: "fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "sync", children: toasts.map((t) => /* @__PURE__ */ jsx(ToastItem, { toast: t, onRemove: removeToast }, t.id)) }) })
  ] });
}
function ToastItem({ toast: toast2, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast2.id), toast2.duration);
    return () => clearTimeout(timer);
  }, [toast2.id, toast2.duration, onRemove]);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 100, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 100, scale: 0.9 },
      transition: { duration: 0.2 },
      className: `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg min-w-[280px] max-w-[400px] ${colors[toast2.type]}`,
      children: [
        /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: icons[toast2.type], className: "text-white text-sm flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-medium flex-1", children: toast2.message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onRemove(toast2.id),
            className: "text-white/70 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faXmark, className: "text-xs" })
          }
        )
      ]
    }
  );
}
function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
let toastInstance = null;
function setToastInstance(instance) {
  toastInstance = instance;
}
const toast = {
  success: (message, options) => {
    if (toastInstance) toastInstance.success(message, options);
  },
  error: (message, options) => {
    if (toastInstance) toastInstance.error(message, options);
  },
  warning: (message, options) => {
    if (toastInstance) toastInstance.warning(message, options);
  },
  info: (message, options) => {
    if (toastInstance) toastInstance.info(message, options);
  }
};
export {
  ToastProvider,
  setToastInstance,
  toast,
  useToast
};
