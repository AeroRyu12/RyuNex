import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { auth } from "../../lib/auth/auth";
function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || searchParams.get("returnUrl");
  useEffect(() => {
    async function handleAuth() {
      const isAuth = await auth.isAuthenticated();
      if (isAuth) {
        navigate(returnUrl || "/", { replace: true });
        return;
      }
      auth.login(returnUrl || void 0);
    }
    handleAuth();
  }, [navigate, returnUrl]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "p-8 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-4", children: "Logging in..." }),
    /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" })
  ] }) });
}
export {
  LoginPage as default
};
