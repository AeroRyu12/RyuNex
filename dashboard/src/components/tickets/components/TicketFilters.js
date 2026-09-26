import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ticketService } from "../../../services/ticketService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
function TicketFilters({ filters, setFilters }) {
  const [options, setOptions] = useState(null);
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const filterOptions = await ticketService.getFilterOptions();
        setOptions(filterOptions);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    }
    fetchFilterOptions();
  }, []);
  if (!options) return null;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      className: "mb-5",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFilter, className: "w-3 h-3 text-primary" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Filters" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.status,
                onChange: (e) => setFilters((prev) => ({ ...prev, status: e.target.value })),
                className: "w-full h-10 rounded-xl text-sm glass-input appearance-none pl-4 pr-10 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Status" }),
                  options.statuses.map((status) => /* @__PURE__ */ jsx("option", { value: status, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.priority,
                onChange: (e) => setFilters((prev) => ({ ...prev, priority: e.target.value })),
                className: "w-full h-10 rounded-xl text-sm glass-input appearance-none pl-4 pr-10 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Priorities" }),
                  options.priorities.map((priority) => /* @__PURE__ */ jsx("option", { value: priority, children: priority }, priority))
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.type,
                onChange: (e) => setFilters((prev) => ({ ...prev, type: e.target.value })),
                className: "w-full h-10 rounded-xl text-sm glass-input appearance-none pl-4 pr-10 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: "All Types" }),
                  options.types.map((type) => /* @__PURE__ */ jsx("option", { value: type.id, children: type.name }, type.id))
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.sortBy,
                onChange: (e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value })),
                className: "w-full h-10 rounded-xl text-sm glass-input appearance-none pl-4 pr-10 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
                  /* @__PURE__ */ jsx("option", { value: "oldest", children: "Oldest First" }),
                  /* @__PURE__ */ jsx("option", { value: "priority", children: "Priority" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  TicketFilters as default
};
