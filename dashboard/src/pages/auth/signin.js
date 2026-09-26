import { jsx, jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../../lib/auth/auth";
const ERROR_MESSAGES = {
  insufficient_permissions: "You don't have permission to access the dashboard. Please contact an administrator.",
  discord_error: "There was an error with Discord authentication. Please try again.",
  no_code: "No authentication code received. Please try again.",
  callback_error: "There was an error during login. Please try again.",
  unknown_error: "You don't have the required roles to access this dashboard. Please contact an administrator.",
  not_allowed: "Access denied. You need specific roles to use this dashboard. Please contact an administrator."
};
function SignInPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const handleDiscordSignIn = () => {
    const returnUrl = searchParams.get("returnUrl");
    auth.login(returnUrl || void 0);
  };
  return /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center min-h-screen bg-background overflow-hidden", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.5, ease: "easeOut" },
      className: "relative z-10 max-w-md w-full mx-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card p-8 md:p-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { delay: 0.2, type: "spring", stiffness: 200 },
                className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6",
                children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-white", children: "D" })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.h2,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.3 },
                className: "text-2xl font-bold text-foreground mb-2",
                children: "Welcome Back"
              }
            ),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.4 },
                className: "text-sm text-muted-foreground",
                children: "Sign in with Discord to access the dashboard"
              }
            ),
            error && ERROR_MESSAGES[error] && /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                className: "mt-6 p-4 glass-subtle rounded-xl border border-destructive/30",
                children: /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: ERROR_MESSAGES[error] })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.5 },
              children: /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleDiscordSignIn,
                  className: "group relative w-full flex items-center justify-center py-3.5 px-4 text-sm font-semibold rounded-xl text-white bg-[#5865F2] hover:bg-[#4752C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2] focus:ring-offset-background transition-all duration-300 hover:-translate-y-0.5",
                  children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faDiscord, className: "h-5 w-5 mr-3" }),
                    "Continue with Discord",
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.6 },
              className: "mt-6 text-center text-xs text-muted-foreground/60",
              children: "By signing in, you agree to our terms of service"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.7 },
            className: "mt-6 text-center",
            children: /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/40", children: "Powered by DrakoBot" })
          }
        )
      ]
    }
  ) });
}
export {
  SignInPage as default
};
