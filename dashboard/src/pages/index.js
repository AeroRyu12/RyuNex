import { jsx } from "react/jsx-runtime";
import React from "react";
import { AuthGuard } from "../components/auth/AuthGuard";
import DashboardPage from "../components/dashboard/page";
function IndexPage() {
  return /* @__PURE__ */ jsx(AuthGuard, { children: /* @__PURE__ */ jsx(DashboardPage, {}) });
}
export {
  IndexPage as default
};
