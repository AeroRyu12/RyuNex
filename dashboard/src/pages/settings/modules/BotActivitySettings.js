import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "../../../components/ui/Toast";
const activityTypes = [
  { value: "PLAYING", label: "Playing" },
  { value: "LISTENING", label: "Listening" },
  { value: "WATCHING", label: "Watching" },
  { value: "STREAMING", label: "Streaming" },
  { value: "COMPETING", label: "Competing" }
];
const statusTypes = [
  { value: "online", label: "Online" },
  { value: "idle", label: "Idle" },
  { value: "dnd", label: "Do Not Disturb" }
];
const placeholders = {
  "Server Stats": [
    { value: "{total-users}", label: "Total members" },
    { value: "{online-members}", label: "Online members" },
    { value: "{total-channels}", label: "Total channels" },
    { value: "{total-messages}", label: "Total messages" },
    { value: "{total-boosts}", label: "Server boosts" }
  ],
  "Bot Stats": [
    { value: "{uptime}", label: "Bot uptime" },
    { value: "{times-bot-started}", label: "Start count" },
    { value: "{total-cases}", label: "Mod cases" }
  ],
  "Tickets": [
    { value: "{open-tickets}", label: "Open tickets" },
    { value: "{closed-tickets}", label: "Closed tickets" },
    { value: "{deleted-tickets}", label: "Deleted tickets" },
    { value: "{total-tickets}", label: "Total tickets" }
  ],
  "Other": [
    { value: "{total-suggestions}", label: "Suggestions" }
  ]
};
function BotActivitySettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    activityType: "PLAYING",
    statusType: "online",
    status: "",
    streamingURL: ""
  });
  useEffect(() => {
    fetchActivities();
  }, []);
  const fetchActivities = async () => {
    try {
      const response = await api.get("/settings/bot-activity");
      setActivities(response.data.activities || []);
      setNewActivity(response.data.current || {
        activityType: "PLAYING",
        statusType: "online",
        status: "",
        streamingURL: ""
      });
    } catch (err) {
      setError("Failed to fetch bot activities");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      if (!newActivity.status.trim()) {
        setError("Activity message is required");
        return;
      }
      if (newActivity.activityType === "STREAMING" && !newActivity.streamingURL) {
        setError("Streaming URL is required for streaming activity type");
        return;
      }
      const activityData = {
        ...newActivity,
        status: newActivity.status.trim(),
        streamingURL: newActivity.activityType === "STREAMING" ? newActivity.streamingURL : null
      };
      await api.post("/settings/bot-activity", activityData);
      setNewActivity({
        activityType: "PLAYING",
        statusType: "online",
        status: "",
        streamingURL: ""
      });
      setError("");
      toast.success("Activity added successfully");
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add activity");
      console.error(err);
    }
  };
  const handleRemoveActivity = async (index) => {
    try {
      await api.delete(`/settings/bot-activity/${index}`);
      toast.success("Activity removed");
      fetchActivities();
    } catch (err) {
      setError("Failed to remove activity");
      console.error(err);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    error && /* @__PURE__ */ jsx("div", { className: "bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm", children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleAddActivity, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Activity Type" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: newActivity.activityType,
              onChange: (e) => setNewActivity({ ...newActivity, activityType: e.target.value }),
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
              children: activityTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type.value, children: type.label }, type.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Status Type" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: newActivity.statusType,
              onChange: (e) => setNewActivity({ ...newActivity, statusType: e.target.value }),
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
              children: statusTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type.value, children: type.label }, type.value))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Activity Message" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: newActivity.status,
            onChange: (e) => setNewActivity({ ...newActivity, status: e.target.value }),
            className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
            placeholder: "Enter activity message"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-3", children: Object.entries(placeholders).map(([category, items]) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: category }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: items.map((item) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setNewActivity({
                ...newActivity,
                status: newActivity.status + item.value
              }),
              className: "px-2 py-1 text-xs font-medium text-foreground bg-secondary border border-border rounded hover:bg-muted transition-colors",
              children: item.label
            },
            item.value
          )) })
        ] }, category)) })
      ] }),
      newActivity.activityType === "STREAMING" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Streaming URL" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "url",
            value: newActivity.streamingURL,
            onChange: (e) => setNewActivity({ ...newActivity, streamingURL: e.target.value }),
            className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
            placeholder: "Enter streaming URL",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          className: "w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3" }),
            "Add Activity"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground", children: "Current Activities" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground bg-secondary px-2 py-1 rounded", children: [
          activities.length,
          " ",
          activities.length === 1 ? "activity" : "activities"
        ] })
      ] }),
      activities.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-secondary rounded-lg p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center", children: "No activities configured" }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: activities.map((activity, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group bg-secondary rounded-lg p-3 flex items-center justify-between hover:bg-muted transition-colors",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-foreground", children: activity.status }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                activityTypes.find((t) => t.value === activity.activityType)?.label,
                " \u2022",
                statusTypes.find((t) => t.value === activity.statusType)?.label
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRemoveActivity(index),
                className: "p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-3 h-3" })
              }
            )
          ]
        },
        index
      )) })
    ] })
  ] });
}
var stdin_default = BotActivitySettings;
export {
  stdin_default as default
};
