import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import TicketList from "./TicketList";
import TicketStats from "./TicketStats";
import TicketFilters from "./TicketFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ticketService } from "../../../services/ticketService";
function TicketsContent() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    avgResponseTime: 0,
    satisfactionRate: 0,
    weeklyChanges: {
      totalTickets: 0,
      openTickets: 0,
      avgResponseTime: 0,
      satisfactionRate: 0
    }
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    priority: searchParams.get("priority") || "all",
    type: searchParams.get("type") || "all",
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "newest"
  });
  useEffect(() => {
    setFilters({
      status: searchParams.get("status") || "all",
      priority: searchParams.get("priority") || "all",
      type: searchParams.get("type") || "all",
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "newest"
    });
  }, [searchParams]);
  useEffect(() => {
    fetchTickets(1);
  }, [filters]);
  async function fetchTickets(page) {
    if (pageLoading) return;
    try {
      setPageLoading(true);
      setPagination((prev) => ({ ...prev, currentPage: page }));
      const data = await ticketService.getTickets(filters, page);
      if (data.tickets) {
        setTickets(data.tickets);
        setPagination({
          currentPage: data.pagination.page,
          totalPages: data.pagination.pages,
          totalItems: data.pagination.total
        });
        const totalTickets = data.stats?.totalTickets || data.pagination.total || 0;
        const openTickets = data.stats?.openTickets || data.tickets.filter((t) => t.status === "open").length || 0;
        setStats({
          totalTickets: Number(totalTickets),
          openTickets: Number(openTickets),
          avgResponseTime: Number(data.stats?.avgResponseTime || 0),
          satisfactionRate: data.stats?.satisfactionRate ?? 96.83,
          weeklyChanges: data.stats?.weeklyChanges || {
            totalTickets: 0,
            openTickets: 0,
            avgResponseTime: 0,
            satisfactionRate: 0
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingSpinner, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 min-w-0 px-4 lg:px-6", children: [
    /* @__PURE__ */ jsx(
      TicketStats,
      {
        tickets,
        totalTickets: stats.totalTickets,
        openTickets: stats.openTickets,
        avgResponseTime: stats.avgResponseTime,
        satisfactionRate: stats.satisfactionRate,
        weeklyChanges: stats.weeklyChanges
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 },
        className: "glass-card p-6",
        children: [
          /* @__PURE__ */ jsx(TicketFilters, { filters, setFilters }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(AnimatePresence, { children: pageLoading && /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                className: "absolute inset-0 glass-subtle flex items-center justify-center rounded-xl z-10",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSpinner, className: "w-5 h-5 text-primary animate-spin" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Loading..." })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-5 relative", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSearch, className: "h-4 w-4 text-muted-foreground/50" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search by display name, Discord username, ticket content, or channel...",
                    value: filters.search,
                    onChange: (e) => setFilters((prev) => ({ ...prev, search: e.target.value })),
                    className: "w-full h-11 rounded-xl text-sm glass-input pl-11 pr-4"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(TicketList, { tickets }),
              /* @__PURE__ */ jsx("div", { className: "mt-3 text-center md:hidden", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground/60", children: "Swipe sideways to see more \u2192" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-5 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left font-medium", children: [
              "Showing ",
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: tickets.length }),
              " of ",
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: pagination.totalItems }),
              " tickets"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center sm:justify-end gap-2", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => !pageLoading && fetchTickets(pagination.currentPage - 1),
                  disabled: pagination.currentPage === 1 || pageLoading,
                  className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
                                ${pagination.currentPage === 1 || pageLoading ? "glass-subtle text-muted-foreground/50 cursor-not-allowed" : "glass-button text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronLeft, className: "w-3 h-3" }),
                    "Previous"
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-1.5", children: Array.from({ length: pagination.totalPages }, (_, i) => i + 1).filter((page) => {
                const current = pagination.currentPage;
                return page === 1 || page === pagination.totalPages || page >= current - 1 && page <= current + 1;
              }).map((page, index, array) => /* @__PURE__ */ jsxs(Fragment, { children: [
                index > 0 && array[index - 1] !== page - 1 && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/50 px-1 flex items-center", children: "..." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => !pageLoading && fetchTickets(page),
                    disabled: pageLoading,
                    className: `w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 
                                                ${pagination.currentPage === page ? "glass-button-primary shadow-glow-sm" : pageLoading ? "glass-subtle text-muted-foreground/50 cursor-not-allowed" : "glass-button text-foreground"}`,
                    children: page
                  }
                )
              ] }, page)) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => !pageLoading && fetchTickets(pagination.currentPage + 1),
                  disabled: pagination.currentPage === pagination.totalPages || pageLoading,
                  className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
                                ${pagination.currentPage === pagination.totalPages || pageLoading ? "glass-subtle text-muted-foreground/50 cursor-not-allowed" : "glass-button text-foreground"}`,
                  children: [
                    "Next",
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronRight, className: "w-3 h-3" })
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  TicketsContent as default
};
