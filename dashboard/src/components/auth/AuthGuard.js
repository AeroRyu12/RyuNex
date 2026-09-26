import { Fragment, jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { auth } from "../../lib/auth/auth";
function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await auth.isAuthenticated();
      setIsAuthenticated(isAuth);
    }
    checkAuth();
  }, []);
  if (!isAuthenticated) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
export {
  AuthGuard
};
