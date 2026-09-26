import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import TicketFilters from "./components/TicketFilters";
import TicketsContent from "./components/TicketsContent";
function TicketsPage() {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    search: "",
    sortBy: "newest"
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(TicketFilters, { filters, setFilters }),
    /* @__PURE__ */ jsx(TicketsContent, { filters })
  ] });
}
export {
  TicketsPage as default
};
