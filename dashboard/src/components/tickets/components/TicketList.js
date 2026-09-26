import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faLock, faHandHolding, faSort, faInbox } from "@fortawesome/free-solid-svg-icons";
import { userDataService } from "../../../utils/userDataService";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import TicketSortModal from "./TicketSortModal";
const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
const formatDateTime = (timestamp) => {
  if (!timestamp) return "Unknown Date";
  const formats = [
    moment.ISO_8601,
    "MMM D, YYYY, hh:mm A z",
    "MMM D, YYYY, HH:mm z",
    "MMM D, YYYY, h:mm A z",
    "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "YYYY-MM-DD HH:mm:ss"
  ];
  const date = moment(timestamp, formats, true);
  if (date.isValid()) {
    return date.tz(window.DASHBOARD_CONFIG.TIMEZONE).format("MMM D, YYYY [at] h:mm A z");
  }
  return timestamp;
};
function TicketList({ tickets: initialTickets = [] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [userDisplayData, setUserDisplayData] = useState({});
  const [loading, setLoading] = useState({});
  const [supportPermissions, setSupportPermissions] = useState({});
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState([
    { status: "open", order: 1 },
    { status: "closed", order: 2 },
    { status: "deleted", order: 3 }
  ]);
  useEffect(() => {
    setTickets(initialTickets);
    const loadPermissions = async () => {
      setIsLoadingPermissions(true);
      const uniqueTypes = Array.from(new Set(initialTickets.map((ticket) => ticket.type)));
      const permissions = {};
      try {
        const permissionPromises = uniqueTypes.map(async (type) => {
          try {
            const response = await fetch(`/api/tickets/permissions/${type}`);
            if (response.ok) {
              const { hasSupport } = await response.json();
              permissions[type] = hasSupport;
            }
          } catch (error) {
            console.error(`Error checking permissions for type ${type}:`, error);
            permissions[type] = false;
          }
        });
        await Promise.all(permissionPromises);
        setSupportPermissions(permissions);
      } catch (error) {
        console.error("Error checking support permissions:", error);
      } finally {
        setIsLoadingPermissions(false);
      }
    };
    loadPermissions();
  }, [initialTickets]);
  useEffect(() => {
    const loadUserData = async () => {
      if (!tickets.length) return;
      const uniqueUsers = Array.from(/* @__PURE__ */ new Set([
        ...tickets.map((ticket) => ticket.creator),
        ...tickets.map((ticket) => ticket.assignee).filter((assignee) => assignee !== null)
      ]));
      const userDataPromises = uniqueUsers.map(async (userId) => {
        const data = await userDataService.getUserData(userId);
        return [userId, data];
      });
      const userData = await Promise.all(userDataPromises);
      const initialData = Object.fromEntries(
        userData.map(([userId, data]) => [
          userId,
          {
            avatar: data.avatar,
            displayName: data.displayName
          }
        ])
      );
      setUserDisplayData(initialData);
      userDataService.prefetchUsers(uniqueUsers);
    };
    loadUserData();
    const handleUserUpdate = (event) => {
      const { userId, userData } = event.detail;
      setUserDisplayData((prev) => ({
        ...prev,
        [userId]: {
          avatar: userData.avatar,
          displayName: userData.displayName
        }
      }));
    };
    window.addEventListener("userDataUpdated", handleUserUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", handleUserUpdate);
    };
  }, [tickets]);
  useEffect(() => {
    loadUserSortPreferences();
  }, []);
  const loadUserSortPreferences = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const { ticketPreferences } = await response.json();
        if (ticketPreferences?.statusOrder) {
          setStatusOrder(ticketPreferences.statusOrder);
          applySort(initialTickets, ticketPreferences.statusOrder);
        }
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
    }
  };
  const saveUserSortPreferences = async (newStatusOrder) => {
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticketPreferences: {
            statusOrder: newStatusOrder
          }
        })
      });
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  };
  const applySort = (ticketsToSort, order) => {
    const statusOrderMap = new Map(order.map((item) => [item.status, item.order]));
    const sortedTickets = [...ticketsToSort].sort((a, b) => {
      const orderA = statusOrderMap.get(a.status) || 999;
      const orderB = statusOrderMap.get(b.status) || 999;
      return orderA - orderB;
    });
    setTickets(sortedTickets);
  };
  const handleSortSave = async (newStatusOrder) => {
    setStatusOrder(newStatusOrder);
    applySort(tickets, newStatusOrder);
    await saveUserSortPreferences(newStatusOrder);
  };
  const handleClaimTicket = async (ticketId) => {
    try {
      setLoading((prev) => ({ ...prev, [`claim-${ticketId}`]: true }));
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/tickets/claim/${ticketId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to claim ticket");
      }
      const result = await response.json();
      setTickets(
        (prevTickets) => prevTickets.map(
          (ticket) => ticket.id === ticketId ? {
            ...ticket,
            claimed: result.ticket.claimed,
            claimedBy: result.ticket.claimedBy,
            assignee: result.ticket.assignee
          } : ticket
        )
      );
      if (result.ticket.claimedBy && !userDisplayData[result.ticket.claimedBy]) {
        const userData = await userDataService.getUserData(result.ticket.claimedBy);
        setUserDisplayData((prev) => ({
          ...prev,
          [result.ticket.claimedBy]: {
            avatar: userData.avatar,
            displayName: userData.displayName
          }
        }));
      }
    } catch (error) {
      console.error("Error claiming ticket:", error);
      alert(error instanceof Error ? error.message : "Failed to claim ticket");
    } finally {
      setLoading((prev) => ({ ...prev, [`claim-${ticketId}`]: false }));
    }
  };
  const handleCloseTicket = async (ticketId) => {
    try {
      const reason = prompt("Enter a reason for closing the ticket (optional):");
      if (reason !== null) {
        setLoading((prev) => ({ ...prev, [`close-${ticketId}`]: true }));
        alert("The ticket will now be closed.");
        setTickets(
          (prevTickets) => prevTickets.map(
            (ticket) => ticket.id === ticketId ? { ...ticket, status: "closing" } : ticket
          )
        );
        const csrfToken = getCsrfToken();
        const response = await fetch(`/api/tickets/close/${ticketId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
          },
          body: JSON.stringify({ reason })
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to close ticket");
        }
        setTickets(
          (prevTickets) => prevTickets.map(
            (ticket) => ticket.id === ticketId ? {
              ...ticket,
              status: "closed",
              statusStyle: "bg-red-500/15 text-red-300 border border-red-500/30"
            } : ticket
          )
        );
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
      alert(error instanceof Error ? error.message : "Failed to close ticket");
      setTickets(
        (prevTickets) => prevTickets.map(
          (ticket) => ticket.id === ticketId ? {
            ...ticket,
            status: "open",
            statusStyle: "bg-green-500/15 text-green-300 border border-green-500/30"
          } : ticket
        )
      );
    } finally {
      setLoading((prev) => ({ ...prev, [`close-${ticketId}`]: false }));
    }
  };
  if (!tickets?.length) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 px-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl glass-subtle flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faInbox, className: "w-6 h-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "No tickets found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Try adjusting your filters" })
    ] });
  }
  const getNumericId = (id) => {
    if (typeof id === "number") return id;
    return id.toString().replace("#", "");
  };
  if (isLoadingPermissions) {
    return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto glass-subtle rounded-xl", children: /* @__PURE__ */ jsx("div", { className: "min-w-[800px]", children: /* @__PURE__ */ jsxs("table", { className: "w-full divide-y divide-border/30 table-fixed lg:table-auto", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "glass-subtle", children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[8%]", children: "ID" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[12%]", children: "Type" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[15%]", children: "Created By" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[10%]", children: "Status" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[10%]", children: "Priority" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[12%]", children: "Created" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[15%]", children: "Claimed By" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[23%] sm:w-[20%]", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Actions" }) })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/20", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxs("tr", { className: "animate-pulse", children: [
        /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-10 bg-secondary/50 rounded-lg" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-16 sm:w-24 bg-secondary/50 rounded-lg" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-secondary/50" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-16 sm:w-24 bg-secondary/50 rounded-lg" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-12 sm:w-16 bg-secondary/50 rounded-full" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-12 sm:w-16 bg-secondary/50 rounded-full" }) }),
        /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-16 sm:w-32 bg-secondary/50 rounded-lg" }) }),
        /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-secondary/50" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-16 sm:w-24 bg-secondary/50 rounded-lg" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-end sm:justify-start gap-2", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-16 rounded-lg bg-primary/10" }) }) })
      ] }, i)) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto glass-subtle rounded-xl", children: [
    /* @__PURE__ */ jsx("div", { className: "min-w-[800px]", children: /* @__PURE__ */ jsxs("table", { className: "w-full divide-y divide-border/30 table-fixed lg:table-auto", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "glass-subtle", children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[8%]", children: "ID" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[12%]", children: "Type" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[15%]", children: "Created By" }),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-200 select-none group w-[10%]",
            onClick: () => setIsSortModalOpen(true),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Status" }),
              /* @__PURE__ */ jsx(
                FontAwesomeIcon,
                {
                  icon: faSort,
                  className: "w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[10%]", children: "Priority" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[12%]", children: "Created" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[15%]", children: "Claimed By" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-2 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[23%] sm:w-[20%]", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Actions" }) })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/20", children: tickets.map((ticket, index) => {
        const numericId = getNumericId(ticket.id);
        const userData = userDisplayData[ticket.creator] || userDataService.getDefaultUserData(ticket.creator);
        return /* @__PURE__ */ jsxs(
          motion.tr,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.03 },
            className: "group hover:bg-secondary/30 transition-all duration-200",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/tickets/${numericId}/transcript`,
                  className: "text-primary hover:text-primary/80 transition-all duration-200 font-semibold font-mono",
                  children: [
                    "#",
                    numericId
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 text-sm text-foreground whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-lg glass-subtle text-foreground text-xs sm:text-sm font-medium", children: ticket.typeName || ticket.type }) }),
              /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: userData.avatar,
                    alt: userData.displayName,
                    className: "w-7 h-7 rounded-lg ring-2 ring-border/30 group-hover:ring-primary/30 transition-all duration-200 object-cover"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm font-medium text-foreground truncate", children: userData.displayName })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${ticket.status === "open" ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.5)]" : ticket.status === "closed" ? "bg-zinc-500/15 text-zinc-400" : "bg-amber-500/15 text-amber-400 shadow-[0_0_10px_-3px_rgba(245,158,11,0.5)]"}`, children: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${ticket.priority === "high" ? "bg-rose-500/15 text-rose-400" : ticket.priority === "medium" ? "bg-amber-500/15 text-amber-400" : "bg-sky-500/15 text-sky-400"}`, children: ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) }) }),
              /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 text-sm text-muted-foreground whitespace-nowrap font-mono", children: formatDateTime(ticket.createdAt) }),
              /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap", children: ticket.assignee ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: userDisplayData[ticket.assignee]?.avatar || userDataService.getDefaultUserData(ticket.assignee).avatar,
                    alt: userDisplayData[ticket.assignee]?.displayName || "Unknown User",
                    className: "w-7 h-7 rounded-lg ring-2 ring-border/30 object-cover"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm font-medium text-foreground truncate", children: userDisplayData[ticket.assignee]?.displayName || "Unknown User" })
              ] }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground", children: "Unclaimed" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-2 sm:px-4 lg:px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end sm:justify-start gap-2", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: `/tickets/${numericId}/transcript`,
                    className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg glass-button text-primary",
                    title: "View Transcript",
                    children: [
                      /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFileAlt, className: "w-3.5 h-3.5 mr-1.5" }),
                      /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: "View" })
                    ]
                  }
                ),
                ticket.status === "open" && supportPermissions[ticket.type] && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleClaimTicket(numericId),
                      disabled: loading[`claim-${numericId}`],
                      className: `inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${ticket.claimed ? "glass-button text-amber-400" : "glass-button text-primary"}`,
                      title: ticket.claimed ? "Unclaim this ticket" : "Claim this ticket",
                      children: [
                        /* @__PURE__ */ jsx(
                          FontAwesomeIcon,
                          {
                            icon: faHandHolding,
                            className: `w-3.5 h-3.5 mr-1.5 ${loading[`claim-${numericId}`] ? "animate-pulse" : ""}`
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: ticket.claimed ? "Unclaim" : "Claim" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handleCloseTicket(numericId),
                      disabled: loading[`close-${numericId}`],
                      className: "inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg glass-button text-destructive hover:bg-destructive/20",
                      title: "Close Ticket",
                      children: [
                        /* @__PURE__ */ jsx(
                          FontAwesomeIcon,
                          {
                            icon: faLock,
                            className: `w-3.5 h-3.5 mr-1.5 ${loading[`close-${numericId}`] ? "animate-pulse" : ""}`
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: "Close" })
                      ]
                    }
                  )
                ] })
              ] }) })
            ]
          },
          numericId
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(
      TicketSortModal,
      {
        isOpen: isSortModalOpen,
        onClose: () => setIsSortModalOpen(false),
        onSave: handleSortSave,
        initialSortOrder: statusOrder
      }
    )
  ] });
}
export {
  TicketList as default
};
