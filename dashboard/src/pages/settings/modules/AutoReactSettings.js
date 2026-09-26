import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faPencil, faSmile } from "@fortawesome/free-solid-svg-icons";
import { toast } from "../../../components/ui/Toast";
const standardEmojis = [
  "\u{1F44D}",
  "\u{1F44E}",
  "\u2764\uFE0F",
  "\u{1F389}",
  "\u{1F525}",
  "\u{1F440}",
  "\u{1F4AF}",
  "\u2705",
  "\u274C",
  "\u2B50",
  "\u{1F31F}",
  "\u{1F4AA}",
  "\u{1F64F}",
  "\u{1F914}",
  "\u{1F604}",
  "\u{1F60A}",
  "\u{1F642}",
  "\u{1F602}",
  "\u{1F60D}",
  "\u{1F60E}",
  "\u{1F622}",
  "\u{1F62D}",
  "\u{1F624}",
  "\u{1F620}",
  "\u{1F3AE}",
  "\u{1F3B2}",
  "\u{1F3AF}",
  "\u{1F3A8}",
  "\u{1F3AD}",
  "\u{1F3AA}"
];
const safeIncludes = (str, pattern) => {
  if (!str || typeof str !== "string") return false;
  return str.includes(pattern);
};
const getEmojiDisplay = (emoji) => {
  if (!emoji) return null;
  if (safeIncludes(emoji, ":")) {
    try {
      const parts = emoji.split(":");
      const id = parts[2]?.replace(">", "") || "";
      const name = parts[1] || "";
      return {
        isCustom: true,
        url: `https://cdn.discordapp.com/emojis/${id}.png`,
        name
      };
    } catch (err) {
      console.error("Error parsing custom emoji:", err);
      return null;
    }
  }
  return {
    isCustom: false,
    emoji
  };
};
function AutoReactSettings() {
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [serverData, setServerData] = useState({
    emojis: [],
    roles: [],
    channels: []
  });
  const [formData, setFormData] = useState({
    keyword: "",
    emoji: "",
    whitelistRoles: [],
    whitelistChannels: []
  });
  useEffect(() => {
    fetchServerData();
    fetchReactions();
  }, []);
  const fetchServerData = async () => {
    try {
      const response = await api.get("/settings/server-data");
      setServerData(response.data);
    } catch (err) {
      console.error("Failed to fetch server data:", err);
    }
  };
  const fetchReactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/settings/auto-reacts");
      setReactions(data || []);
    } catch (error) {
      console.error("Error fetching auto reacts:", error);
      toast.error("Failed to load auto reactions");
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      keyword: "",
      emoji: "",
      whitelistRoles: [],
      whitelistChannels: []
    });
    setEditingId(null);
    setShowForm(false);
  };
  const handleSubmit = async () => {
    if (!formData.keyword.trim()) {
      toast.error("Keyword is required");
      return;
    }
    if (!formData.emoji) {
      toast.error("Emoji is required");
      return;
    }
    const isDuplicate = reactions.some(
      (reaction) => reaction.keyword.toLowerCase() === formData.keyword.toLowerCase() && reaction._id !== editingId
    );
    if (isDuplicate) {
      toast.error("A reaction with this keyword already exists");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const { data } = await api.put(`/settings/auto-reacts/${editingId}`, formData);
        setReactions(reactions.map((r) => r._id === editingId ? data : r));
        toast.success("Reaction updated");
      } else {
        const { data } = await api.post("/settings/auto-reacts", formData);
        setReactions([...reactions, data]);
        toast.success("Reaction added");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving auto react:", error);
      toast.error(error.response?.data?.error || "Failed to save reaction");
    } finally {
      setSaving(false);
    }
  };
  const handleRemove = async (id) => {
    if (!window.confirm("Remove this auto reaction?")) return;
    try {
      await api.delete(`/settings/auto-reacts/${id}`);
      setReactions(reactions.filter((r) => r._id !== id));
      if (editingId === id) resetForm();
      toast.success("Reaction removed");
    } catch (error) {
      console.error("Error removing auto react:", error);
      toast.error("Failed to remove reaction");
    }
  };
  const startEdit = (reaction) => {
    setFormData({
      keyword: reaction.keyword,
      emoji: reaction.emoji,
      whitelistRoles: reaction.whitelistRoles || [],
      whitelistChannels: reaction.whitelistChannels || []
    });
    setEditingId(reaction._id);
    setShowForm(true);
  };
  const renderEmoji = (emoji, size = "md") => {
    const display = getEmojiDisplay(emoji);
    if (!display) return null;
    const sizeClasses = size === "lg" ? "w-8 h-8 text-3xl" : "w-5 h-5 text-xl";
    return display.isCustom ? /* @__PURE__ */ jsx("img", { src: display.url, alt: display.name, className: sizeClasses }) : /* @__PURE__ */ jsx("span", { className: sizeClasses, children: display.emoji });
  };
  const toggleRole = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      whitelistRoles: prev.whitelistRoles.includes(roleId) ? prev.whitelistRoles.filter((id) => id !== roleId) : [...prev.whitelistRoles, roleId]
    }));
  };
  const toggleChannel = (channelId) => {
    setFormData((prev) => ({
      ...prev,
      whitelistChannels: prev.whitelistChannels.includes(channelId) ? prev.whitelistChannels.filter((id) => id !== channelId) : [...prev.whitelistChannels, channelId]
    }));
  };
  const textChannels = serverData.channels?.filter((c) => c.type === "GUILD_TEXT") || [];
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground bg-secondary px-2 py-1 rounded", children: [
        reactions.length,
        " ",
        reactions.length === 1 ? "reaction" : "reactions"
      ] }) }),
      !showForm && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            resetForm();
            setShowForm(true);
          },
          className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3" }),
            "Add Reaction"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 border border-border rounded-xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground", children: editingId ? "Edit Reaction" : "New Reaction" }),
        /* @__PURE__ */ jsx("button", { onClick: resetForm, className: "text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Keyword" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: formData.keyword,
              onChange: (e) => setFormData({ ...formData, keyword: e.target.value }),
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary",
              placeholder: "Word or phrase that triggers the reaction"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Emoji" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: formData.emoji,
              onChange: (e) => setFormData({ ...formData, emoji: e.target.value }),
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select an emoji" }),
                /* @__PURE__ */ jsx("optgroup", { label: "Standard Emojis", children: standardEmojis.map((emoji) => /* @__PURE__ */ jsx("option", { value: emoji, children: emoji }, emoji)) }),
                serverData.emojis?.length > 0 && /* @__PURE__ */ jsx("optgroup", { label: "Server Emojis", children: serverData.emojis.map((emoji) => /* @__PURE__ */ jsx(
                  "option",
                  {
                    value: emoji.isStandard ? emoji.name : `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`,
                    children: emoji.name
                  },
                  emoji.id
                )) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Whitelist Roles" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Only react to messages from users with these roles" }),
          /* @__PURE__ */ jsx("div", { className: "max-h-40 overflow-y-auto space-y-1 bg-secondary rounded-lg p-2", children: serverData.roles?.length > 0 ? serverData.roles.map((role) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: formData.whitelistRoles.includes(role.id),
                    onChange: () => toggleRole(role.id),
                    className: "rounded border-border bg-background text-primary focus:ring-primary"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "text-sm truncate",
                    style: { color: role.color !== "#000000" ? role.color : void 0 },
                    children: role.name
                  }
                )
              ]
            },
            role.id
          )) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground p-2", children: "No roles available" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Whitelist Channels" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Only react to messages in these channels" }),
          /* @__PURE__ */ jsx("div", { className: "max-h-40 overflow-y-auto space-y-1 bg-secondary rounded-lg p-2", children: textChannels.length > 0 ? textChannels.map((channel) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: formData.whitelistChannels.includes(channel.id),
                    onChange: () => toggleChannel(channel.id),
                    className: "rounded border-border bg-background text-primary focus:ring-primary"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground truncate", children: [
                  "#",
                  channel.name
                ] })
              ]
            },
            channel.id
          )) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground p-2", children: "No channels available" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: resetForm,
            className: "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSubmit,
            disabled: saving,
            className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors",
            children: saving ? "Saving..." : editingId ? "Save Changes" : "Add Reaction"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: reactions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "No auto reactions configured" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/70 text-xs mt-1", children: "Add your first reaction to get started" })
    ] }) : reactions.map((reaction) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `group bg-secondary/50 border rounded-lg overflow-hidden transition-colors ${editingId === reaction._id ? "border-primary" : "border-transparent hover:border-border"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-lg bg-amber-500/10 shrink-0", children: renderEmoji(reaction.emoji, "lg") }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: reaction.keyword }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                reaction.whitelistRoles?.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded", children: [
                  reaction.whitelistRoles.length,
                  " role",
                  reaction.whitelistRoles.length !== 1 ? "s" : ""
                ] }),
                reaction.whitelistChannels?.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded", children: [
                  reaction.whitelistChannels.length,
                  " channel",
                  reaction.whitelistChannels.length !== 1 ? "s" : ""
                ] }),
                !reaction.whitelistRoles?.length && !reaction.whitelistChannels?.length && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "All roles & channels" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => startEdit(reaction),
                className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPencil, className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRemove(reaction._id),
                className: "p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ] })
      },
      reaction._id
    )) })
  ] });
}
var stdin_default = AutoReactSettings;
export {
  stdin_default as default
};
