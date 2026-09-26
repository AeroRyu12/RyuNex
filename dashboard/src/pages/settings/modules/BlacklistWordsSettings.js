import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPlus, faTimes, faShieldAlt, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { toast } from "../../../components/ui/Toast";
function BlacklistWordsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverData, setServerData] = useState({ roles: [], channels: [] });
  const [settings, setSettings] = useState({
    enabled: false,
    patterns: [],
    whitelistWords: [],
    whitelistChannels: [],
    whitelistCategories: [],
    bypassRoles: [],
    logsChannelId: "",
    notificationMessage: "{user}, you used a blacklisted word!"
  });
  const [newPattern, setNewPattern] = useState("");
  const [newWhitelist, setNewWhitelist] = useState("");
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [settingsRes, serverRes] = await Promise.all([
        api.get("/settings/blacklist-words"),
        api.get("/settings/server-data")
      ]);
      const data = settingsRes.data;
      setSettings({
        enabled: data.enabled || false,
        patterns: data.patterns || [],
        whitelistWords: data.whitelistWords || [],
        whitelistChannels: data.whitelistChannels || [],
        whitelistCategories: data.whitelistCategories || [],
        bypassRoles: data.bypassRoles || [],
        logsChannelId: data.logsChannelId || "",
        notificationMessage: data.notificationMessage || "{user}, you used a blacklisted word!"
      });
      setServerData(serverRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/settings/blacklist-words", settings);
      if (data.success) {
        const saved = data.settings;
        setSettings({
          enabled: saved.enabled || false,
          patterns: saved.patterns || [],
          whitelistWords: saved.whitelistWords || [],
          whitelistChannels: saved.whitelistChannels || [],
          whitelistCategories: saved.whitelistCategories || [],
          bypassRoles: saved.bypassRoles || [],
          logsChannelId: saved.logsChannelId || "",
          notificationMessage: saved.notificationMessage || "{user}, you used a blacklisted word!"
        });
        toast.success("Settings saved successfully");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
  const addPattern = () => {
    if (!newPattern.trim()) return;
    if (settings.patterns.includes(newPattern.trim())) {
      toast.error("Pattern already exists");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      patterns: [...prev.patterns, newPattern.trim()]
    }));
    setNewPattern("");
  };
  const removePattern = (index) => {
    setSettings((prev) => ({
      ...prev,
      patterns: prev.patterns.filter((_, i) => i !== index)
    }));
  };
  const addWhitelist = () => {
    if (!newWhitelist.trim()) return;
    if (settings.whitelistWords.includes(newWhitelist.trim())) {
      toast.error("Word already whitelisted");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      whitelistWords: [...prev.whitelistWords, newWhitelist.trim()]
    }));
    setNewWhitelist("");
  };
  const removeWhitelist = (index) => {
    setSettings((prev) => ({
      ...prev,
      whitelistWords: prev.whitelistWords.filter((_, i) => i !== index)
    }));
  };
  const toggleRole = (roleId) => {
    setSettings((prev) => ({
      ...prev,
      bypassRoles: prev.bypassRoles.includes(roleId) ? prev.bypassRoles.filter((id) => id !== roleId) : [...prev.bypassRoles, roleId]
    }));
  };
  const toggleChannel = (channelId) => {
    setSettings((prev) => ({
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
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.enabled,
              onChange: (e) => setSettings((prev) => ({ ...prev, enabled: e.target.checked })),
              className: "sr-only peer"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Enable Blacklist Words" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSave,
          disabled: saving,
          className: "bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors",
          children: saving ? "Saving..." : "Save Changes"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-foreground mb-2", children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faBan, className: "mr-2 text-destructive" }),
          "Blocked Patterns"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Use * for wildcards (e.g., *badword*) or prefix with regex: for regular expressions" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newPattern,
              onChange: (e) => setNewPattern(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && addPattern(),
              placeholder: "Enter pattern (e.g., discord.gg/* or *badword*)",
              className: "flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: addPattern,
              className: "bg-primary text-primary-foreground rounded-lg px-3 py-2 hover:bg-primary/90 transition-colors",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          settings.patterns.map((pattern, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-3 py-1.5 rounded-lg text-sm",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: pattern }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => removePattern(index),
                    className: "hover:text-destructive/80 transition-colors",
                    children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-3 h-3" })
                  }
                )
              ]
            },
            index
          )),
          settings.patterns.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No patterns added" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-foreground mb-2", children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faShieldAlt, className: "mr-2 text-green-500" }),
          "Whitelisted Words"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "These words will bypass the filter even if they match a pattern" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newWhitelist,
              onChange: (e) => setNewWhitelist(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && addWhitelist(),
              placeholder: "Enter word to whitelist",
              className: "flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: addWhitelist,
              className: "bg-green-600 text-white rounded-lg px-3 py-2 hover:bg-green-700 transition-colors",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          settings.whitelistWords.map((word, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 px-3 py-1.5 rounded-lg text-sm",
              children: [
                /* @__PURE__ */ jsx("span", { children: word }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => removeWhitelist(index),
                    className: "hover:text-green-400 transition-colors",
                    children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-3 h-3" })
                  }
                )
              ]
            },
            index
          )),
          settings.whitelistWords.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No words whitelisted" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Bypass Roles" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Users with these roles bypass the filter" }),
          /* @__PURE__ */ jsx("div", { className: "max-h-48 overflow-y-auto space-y-1 bg-secondary/50 rounded-lg p-2", children: serverData.roles?.map((role) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings.bypassRoles.includes(role.id),
                    onChange: () => toggleRole(role.id),
                    className: "rounded border-border bg-secondary text-primary focus:ring-primary"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "text-sm",
                    style: { color: role.color !== "#000000" ? role.color : void 0 },
                    children: role.name
                  }
                )
              ]
            },
            role.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-foreground mb-2", children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faHashtag, className: "mr-2" }),
            "Whitelisted Channels"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Filter is disabled in these channels" }),
          /* @__PURE__ */ jsx("div", { className: "max-h-48 overflow-y-auto space-y-1 bg-secondary/50 rounded-lg p-2", children: textChannels.map((channel) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings.whitelistChannels.includes(channel.id),
                    onChange: () => toggleChannel(channel.id),
                    className: "rounded border-border bg-secondary text-primary focus:ring-primary"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-foreground", children: [
                  "#",
                  channel.name
                ] })
              ]
            },
            channel.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Logs Channel" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: settings.logsChannelId,
              onChange: (e) => setSettings((prev) => ({ ...prev, logsChannelId: e.target.value })),
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "No logging" }),
                textChannels.map((channel) => /* @__PURE__ */ jsxs("option", { value: channel.id, children: [
                  "#",
                  channel.name
                ] }, channel.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Notification Message" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: settings.notificationMessage,
              onChange: (e) => setSettings((prev) => ({ ...prev, notificationMessage: e.target.value })),
              placeholder: "{user}, you used a blacklisted word!",
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Use ",
            "{user}",
            " to mention the user"
          ] })
        ] })
      ] })
    ] })
  ] });
}
var stdin_default = BlacklistWordsSettings;
export {
  stdin_default as default
};
