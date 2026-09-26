import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCode, faFont, faTimes, faPencil, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { toast } from "../../../components/ui/Toast";
function AutoResponseSettings() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [responseType, setResponseType] = useState("text");
  const [formData, setFormData] = useState({
    trigger: "",
    content: "",
    embed: {
      title: "",
      description: "",
      color: "#5865F2",
      author: { name: "", icon_url: "" },
      footer: { text: "", icon_url: "" },
      thumbnail: "",
      image: "",
      timestamp: false
    }
  });
  useEffect(() => {
    fetchResponses();
  }, []);
  const fetchResponses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/settings/auto-responses");
      setResponses(data);
    } catch (error) {
      console.error("Error fetching auto responses:", error);
      toast.error("Failed to load auto responses");
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      trigger: "",
      content: "",
      embed: {
        title: "",
        description: "",
        color: "#5865F2",
        author: { name: "", icon_url: "" },
        footer: { text: "", icon_url: "" },
        thumbnail: "",
        image: "",
        timestamp: false
      }
    });
    setResponseType("text");
    setEditingId(null);
    setShowForm(false);
  };
  const handleSubmit = async () => {
    if (!formData.trigger.trim()) {
      toast.error("Trigger is required");
      return;
    }
    if (responseType === "text" && !formData.content.trim()) {
      toast.error("Response message is required");
      return;
    }
    const isDuplicate = responses.some(
      (response) => response.trigger.toLowerCase() === formData.trigger.toLowerCase() && response._id !== editingId
    );
    if (isDuplicate) {
      toast.error("A response with this trigger already exists");
      return;
    }
    setSaving(true);
    try {
      const cleanEmbed = {
        title: formData.embed.title?.trim() || "",
        description: formData.embed.description?.trim() || "",
        color: formData.embed.color || "#5865F2",
        fields: formData.embed.fields || []
      };
      if (formData.embed.author?.name?.trim()) {
        cleanEmbed.author = {
          name: formData.embed.author.name.trim(),
          icon_url: formData.embed.author.icon_url?.trim() || null
        };
      }
      if (formData.embed.footer?.text?.trim()) {
        cleanEmbed.footer = {
          text: formData.embed.footer.text.trim(),
          icon_url: formData.embed.footer.icon_url?.trim() || null
        };
      }
      if (formData.embed.thumbnail?.trim()) {
        cleanEmbed.thumbnail = { url: formData.embed.thumbnail.trim() };
      }
      if (formData.embed.image?.trim()) {
        cleanEmbed.image = { url: formData.embed.image.trim() };
      }
      if (formData.embed.timestamp) {
        cleanEmbed.timestamp = true;
      }
      const responseData = {
        trigger: formData.trigger.trim(),
        type: responseType,
        responseType: responseType.toUpperCase(),
        ...responseType === "text" ? {
          content: formData.content?.trim() || ""
        } : {
          embed: cleanEmbed
        }
      };
      if (editingId) {
        const { data } = await api.put(`/settings/auto-responses/${editingId}`, responseData);
        setResponses(responses.map((r) => r._id === editingId ? data : r));
        toast.success("Response updated");
      } else {
        const { data } = await api.post("/settings/auto-responses", responseData);
        setResponses([...responses, data]);
        toast.success("Response added");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving auto response:", error);
      toast.error(error.response?.data?.error || "Failed to save auto response");
    } finally {
      setSaving(false);
    }
  };
  const handleRemove = async (id) => {
    if (!window.confirm("Remove this auto response?")) return;
    try {
      await api.delete(`/settings/auto-responses/${id}`);
      setResponses(responses.filter((r) => r._id !== id));
      if (editingId === id) resetForm();
      toast.success("Response removed");
    } catch (error) {
      console.error("Error removing auto response:", error);
      toast.error("Failed to remove response");
    }
  };
  const startEdit = (response) => {
    const type = response.type === "embed" || response.responseType === "EMBED" ? "embed" : "text";
    setResponseType(type);
    setFormData({
      trigger: response.trigger,
      content: response.content || "",
      embed: response.embed ? {
        title: response.embed.title || "",
        description: response.embed.description || "",
        color: response.embed.color || "#5865F2",
        author: {
          name: response.embed.author?.name || "",
          icon_url: response.embed.author?.icon_url || ""
        },
        footer: {
          text: response.embed.footer?.text || "",
          icon_url: response.embed.footer?.icon_url || ""
        },
        thumbnail: response.embed.thumbnail?.url || "",
        image: response.embed.image?.url || "",
        timestamp: response.embed.timestamp || false,
        fields: response.embed.fields || []
      } : {
        title: "",
        description: "",
        color: "#5865F2",
        author: { name: "", icon_url: "" },
        footer: { text: "", icon_url: "" },
        thumbnail: "",
        image: "",
        timestamp: false,
        fields: []
      }
    });
    setEditingId(response._id);
    setShowForm(true);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground bg-secondary px-2 py-1 rounded", children: [
        responses.length,
        " ",
        responses.length === 1 ? "response" : "responses"
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
            "Add Response"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 border border-border rounded-xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground", children: editingId ? "Edit Response" : "New Response" }),
        /* @__PURE__ */ jsx("button", { onClick: resetForm, className: "text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Trigger" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: formData.trigger,
            onChange: (e) => setFormData({ ...formData, trigger: e.target.value }),
            className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary",
            placeholder: "Word or phrase that triggers the response"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Response Type" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setResponseType("text"),
              className: `flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${responseType === "text" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFont, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Text" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setResponseType("embed"),
              className: `flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${responseType === "embed" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCode, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Embed" })
              ]
            }
          )
        ] })
      ] }),
      responseType === "text" ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Response Message" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: formData.content,
            onChange: (e) => setFormData({ ...formData, content: e.target.value }),
            className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none",
            placeholder: "Message to send when triggered",
            rows: 4
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4 bg-secondary rounded-lg p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Title" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: formData.embed.title,
                onChange: (e) => setFormData({
                  ...formData,
                  embed: { ...formData.embed, title: e.target.value }
                }),
                className: "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                placeholder: "Embed title"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Color" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "color",
                  value: formData.embed.color,
                  onChange: (e) => setFormData({
                    ...formData,
                    embed: { ...formData.embed, color: e.target.value }
                  }),
                  className: "h-[38px] w-16 bg-background border border-border rounded-lg cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.embed.color,
                  onChange: (e) => setFormData({
                    ...formData,
                    embed: { ...formData.embed, color: e.target.value }
                  }),
                  className: "flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: formData.embed.description,
              onChange: (e) => setFormData({
                ...formData,
                embed: { ...formData.embed, description: e.target.value }
              }),
              className: "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none",
              placeholder: "Embed description",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Thumbnail URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: formData.embed.thumbnail,
                onChange: (e) => setFormData({
                  ...formData,
                  embed: { ...formData.embed, thumbnail: e.target.value }
                }),
                className: "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                placeholder: "https://..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Image URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: formData.embed.image,
                onChange: (e) => setFormData({
                  ...formData,
                  embed: { ...formData.embed, image: e.target.value }
                }),
                className: "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                placeholder: "https://..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: formData.embed.timestamp,
                onChange: (e) => setFormData({
                  ...formData,
                  embed: { ...formData.embed, timestamp: e.target.checked }
                }),
                className: "sr-only peer"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: "Include timestamp" })
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
            children: saving ? "Saving..." : editingId ? "Save Changes" : "Add Response"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: responses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "No auto responses configured" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/70 text-xs mt-1", children: "Add your first response to get started" })
    ] }) : responses.map((response) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `group bg-secondary/50 border rounded-lg overflow-hidden transition-colors ${editingId === response._id ? "border-primary" : "border-transparent hover:border-border"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg shrink-0 ${response.type === "embed" || response.responseType === "EMBED" ? "bg-violet-500/10 text-violet-500" : "bg-primary/10 text-primary"}`, children: /* @__PURE__ */ jsx(
              FontAwesomeIcon,
              {
                icon: response.type === "embed" || response.responseType === "EMBED" ? faCode : faFont,
                className: "w-4 h-4"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: response.trigger }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded", children: response.type === "embed" || response.responseType === "EMBED" ? "embed" : "text" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1 truncate", children: response.type === "embed" || response.responseType === "EMBED" ? response.embed?.title || response.embed?.description || "Embed response" : response.content })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => startEdit(response),
                className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPencil, className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRemove(response._id),
                className: "p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ] })
      },
      response._id
    )) })
  ] });
}
var stdin_default = AutoResponseSettings;
export {
  stdin_default as default
};
