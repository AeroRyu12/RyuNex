import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api/axios";
import { toast } from "../../../components/ui/Toast";
import { socket } from "../../../socket";
function DashboardSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    navName: "DrakoBot",
    favicon: "None",
    tabName: "DrakoBot Dashboard",
    customNavItems: [],
    categories: {
      navigation: "Navigation",
      custom: "Custom Links",
      addons: "Addons"
    }
  });
  useEffect(() => {
    fetchSettings();
    socket.on("dashboardSettingsUpdated", setSettings);
    return () => socket.off("dashboardSettingsUpdated", setSettings);
  }, []);
  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/settings/dashboard");
      setSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const processedSettings = {
      ...settings,
      favicon: settings.favicon?.trim() || "None"
    };
    try {
      const { data } = await api.post("/settings/dashboard", processedSettings);
      if (data.success) {
        setSettings(data.settings);
        toast.success("Settings saved successfully");
      } else {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Navigation Name" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: settings.navName,
          onChange: (e) => setSettings({ ...settings, navName: e.target.value }),
          className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
          placeholder: "Enter navigation name"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: "This will appear in the side navigation bar" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Tab Name" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: settings.tabName,
          onChange: (e) => setSettings({ ...settings, tabName: e.target.value }),
          className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
          placeholder: "Enter tab name"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: "This will appear as the browser tab title" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-1.5", children: "Favicon URL" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          value: settings.favicon === "None" ? "" : settings.favicon,
          onChange: (e) => setSettings({ ...settings, favicon: e.target.value || "None" }),
          className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors",
          placeholder: "Enter favicon URL or leave empty for none"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: "This will appear as the browser tab icon" })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: saving,
        className: "w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors",
        children: saving ? "Saving..." : "Save Changes"
      }
    )
  ] });
}
var stdin_default = DashboardSettings;
export {
  stdin_default as default
};
