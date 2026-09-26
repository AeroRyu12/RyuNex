import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faLightbulb, faCheck, faXmark, faClock } from "@fortawesome/free-solid-svg-icons";
import SuggestionCard from "./components/SuggestionCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  useEffect(() => {
    fetchSuggestions();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/suggestions");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch suggestions (${response.status})`);
      }
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = async (id, reason) => {
    try {
      setError(null);
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/suggestions/${id}/accept`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        },
        body: JSON.stringify({ reason: reason.trim() || "No reason provided" })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to accept suggestion");
      }
      setSuggestions(
        (prev) => prev.map(
          (s) => s.uniqueId === id ? { ...s, status: "Accepted", reason: reason.trim() || "No reason provided" } : s
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept suggestion");
    }
  };
  const handleDeny = async (id, reason) => {
    try {
      setError(null);
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/suggestions/${id}/deny`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        },
        body: JSON.stringify({ reason: reason.trim() || "No reason provided" })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to deny suggestion");
      }
      setSuggestions(
        (prev) => prev.map(
          (s) => s.uniqueId === id ? { ...s, status: "Denied", reason: reason.trim() || "No reason provided" } : s
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deny suggestion");
    }
  };
  const handleDelete = async (id) => {
    try {
      setError(null);
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/suggestions/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}
      });
      if (!response.ok) throw new Error("Failed to delete suggestion");
      setSuggestions((prev) => prev.filter((s) => s.uniqueId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete suggestion");
    }
  };
  const filteredSuggestions = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return suggestions.filter((suggestion) => {
      if (!suggestion) return false;
      const matchesSearch = (suggestion.text?.toLowerCase() || "").includes(searchLower) || (suggestion.authorId?.toLowerCase() || "").includes(searchLower);
      const matchesStatus = activeTab === "pending" && suggestion.status === "Pending" || activeTab === "accepted" && suggestion.status === "Accepted" || activeTab === "denied" && suggestion.status === "Denied";
      return matchesSearch && matchesStatus;
    });
  }, [suggestions, searchQuery, activeTab]);
  const totalPages = Math.ceil(filteredSuggestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuggestions = filteredSuggestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const stats = {
    total: suggestions.length,
    pending: suggestions.filter((s) => s.status === "Pending").length,
    accepted: suggestions.filter((s) => s.status === "Accepted").length,
    denied: suggestions.filter((s) => s.status === "Denied").length
  };
  if (loading) return /* @__PURE__ */ jsx(LoadingSpinner, {});
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 min-w-0 px-4 lg:px-6 max-w-[1600px] mx-auto w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl p-4 border border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLightbulb, className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: stats.total }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl p-4 border border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-amber-500/10 rounded-lg", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faClock, className: "w-4 h-4 text-amber-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: stats.pending }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Pending" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl p-4 border border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-green-500/10 rounded-lg", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCheck, className: "w-4 h-4 text-green-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: stats.accepted }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Accepted" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl p-4 border border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-red-500/10 rounded-lg", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faXmark, className: "w-4 h-4 text-red-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: stats.denied }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Denied" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl p-5 border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("pending"),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "pending" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
              children: [
                "Pending (",
                stats.pending,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("accepted"),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "accepted" ? "bg-green-600 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
              children: [
                "Accepted (",
                stats.accepted,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("denied"),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "denied" ? "bg-red-600 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
              children: [
                "Denied (",
                stats.denied,
                ")"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-72", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSearch, className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search suggestions...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm w-full placeholder-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { children: error }),
        /* @__PURE__ */ jsx("button", { onClick: () => setError(null), className: "text-red-400 hover:text-red-300", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faXmark }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        pageLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg z-10", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSpinner, className: "w-6 h-6 text-primary animate-spin" }) }),
        paginatedSuggestions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLightbulb, className: "w-12 h-12 text-muted-foreground/30 mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: searchQuery ? `No suggestions matching "${searchQuery}"` : "No suggestions in this category" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: paginatedSuggestions.map((suggestion) => /* @__PURE__ */ jsx(
          SuggestionCard,
          {
            suggestion,
            onAccept: handleAccept,
            onDeny: handleDeny,
            onDelete: handleDelete
          },
          suggestion.uniqueId
        )) })
      ] }),
      filteredSuggestions.length > ITEMS_PER_PAGE && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "Showing ",
          startIndex + 1,
          "-",
          Math.min(startIndex + ITEMS_PER_PAGE, filteredSuggestions.length),
          " of ",
          filteredSuggestions.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
              disabled: currentPage === 1,
              className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 ? "bg-secondary text-muted-foreground cursor-not-allowed" : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"}`,
              children: "Previous"
            }
          ),
          Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1).map((page, index, array) => /* @__PURE__ */ jsxs(Fragment, { children: [
            index > 0 && array[index - 1] !== page - 1 && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground px-1", children: "..." }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setCurrentPage(page),
                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                children: page
              }
            )
          ] }, page)),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
              disabled: currentPage === totalPages,
              className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages ? "bg-secondary text-muted-foreground cursor-not-allowed" : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"}`,
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  SuggestionsPage as default
};
