import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faClock, faUser, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { userDataService } from "../../../utils/userDataService";
function SuggestionCard({ suggestion, onAccept, onDeny, onDelete }) {
  const [isActioning, setIsActioning] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userDataService.getUserData(suggestion.authorId);
        if (data) setUserData(data);
      } catch (e) {
      }
    };
    fetchUser();
  }, [suggestion.authorId]);
  const handleAction = async (action) => {
    setIsActioning(true);
    try {
      if (action === "accept") {
        await onAccept(suggestion.uniqueId, actionReason);
      } else {
        await onDeny(suggestion.uniqueId, actionReason);
      }
    } finally {
      setIsActioning(false);
      setActionReason("");
    }
  };
  const formattedDate = new Date(suggestion.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const shouldTruncate = suggestion.text.length > 150;
  const displayText = shouldTruncate && !expanded ? suggestion.text.slice(0, 150) + "..." : suggestion.text;
  const statusConfig = {
    Pending: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
    Accepted: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20" },
    Denied: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" }
  };
  const status = statusConfig[suggestion.status] || statusConfig.Pending;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 border border-border rounded-xl p-4 flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          userData ? /* @__PURE__ */ jsx(
            "img",
            {
              src: userData.avatar || "https://cdn.discordapp.com/embed/avatars/0.png",
              alt: "",
              className: "w-10 h-10 rounded-full flex-shrink-0"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faUser, className: "w-4 h-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: userData?.displayName || "Loading..." }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faClock, className: "w-3 h-3" }),
              /* @__PURE__ */ jsx("span", { children: formattedDate })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.text}`, children: suggestion.status }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowDeleteConfirm(true),
              className: "p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/90 whitespace-pre-wrap break-words", children: displayText }),
        shouldTruncate && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setExpanded(!expanded),
            className: "text-xs text-primary hover:underline mt-2",
            children: expanded ? "Show less" : "Show more"
          }
        )
      ] }),
      suggestion.status === "Pending" && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border space-y-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Reason (optional)",
            value: actionReason,
            onChange: (e) => setActionReason(e.target.value),
            className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg placeholder-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleAction("accept"),
              disabled: isActioning,
              className: "flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50",
              children: isActioning ? /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSpinner, className: "animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCheck, className: "mr-1.5" }),
                "Accept"
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleAction("deny"),
              disabled: isActioning,
              className: "flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50",
              children: isActioning ? /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSpinner, className: "animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faXmark, className: "mr-1.5" }),
                "Deny"
              ] })
            }
          )
        ] })
      ] }),
      suggestion.status !== "Pending" && suggestion.reason && /* @__PURE__ */ jsxs("div", { className: `mt-4 p-3 rounded-lg text-sm ${status.bg} border ${status.border}`, children: [
        /* @__PURE__ */ jsx("span", { className: `font-medium ${status.text}`, children: "Reason:" }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground/80 mt-1", children: suggestion.reason })
      ] })
    ] }),
    showDeleteConfirm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4", onClick: () => setShowDeleteConfirm(false), children: /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6 max-w-md w-full", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Delete Suggestion" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Are you sure? This will remove the suggestion from both the dashboard and Discord." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDeleteConfirm(false),
            className: "flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onDelete(suggestion.uniqueId);
              setShowDeleteConfirm(false);
            },
            className: "flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  SuggestionCard as default
};
