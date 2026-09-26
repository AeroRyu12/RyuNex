import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faHashtag, faChevronDown, faSave, faBookmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "../../../components/ui/Toast";
import ComponentSelector from "./ComponentSelector";
import TemplatesModal from "./TemplatesModal";
const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
import {
  TitleComponent,
  DescriptionComponent,
  ColorComponent,
  AuthorComponent,
  FieldsComponent,
  FooterComponent,
  ImageComponent,
  ThumbnailComponent,
  LinkButtonsComponent
} from "./EmbedComponents";
import { parse } from "discord-markdown-parser";
const defaultEmbed = {
  title: "",
  description: "",
  color: "#000000",
  author: {
    name: "",
    icon_url: ""
  },
  thumbnail: "",
  image: "",
  footer: {
    text: "",
    icon_url: ""
  },
  fields: [],
  linkButtons: []
};
const renderMarkdown = (content) => {
  const parsed = parse(content);
  const renderNode = (node, key) => {
    if (typeof node === "string") return node;
    let children;
    if (Array.isArray(node.content)) {
      children = node.content.map((child, i) => renderNode(child, i));
    } else if (typeof node.content === "object" && node.content !== null) {
      children = renderNode(node.content, 0);
    } else {
      children = node.content;
    }
    switch (node.type) {
      case "em":
        return /* @__PURE__ */ jsx("em", { children }, key);
      case "strong":
        return /* @__PURE__ */ jsx("strong", { children }, key);
      case "underline":
        return /* @__PURE__ */ jsx("u", { children }, key);
      case "strike":
        return /* @__PURE__ */ jsx("s", { children }, key);
      case "inlineCode":
        return /* @__PURE__ */ jsx("code", { className: "bg-[#2f3136] px-1 py-0.5 rounded text-[0.9em]", children }, key);
      case "codeBlock":
        return /* @__PURE__ */ jsx("pre", { className: "bg-[#2f3136] p-2 rounded mt-1 mb-1", children: /* @__PURE__ */ jsx("code", { children }) }, key);
      default:
        return children;
    }
  };
  return parsed.map((node, i) => renderNode(node, i));
};
const EmbedBuilder = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [templates, setTemplates] = useState([]);
  const [embed, setEmbed] = useState(defaultEmbed);
  const [activeComponents, setActiveComponents] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  useEffect(() => {
    fetchChannels();
    fetchTemplates();
  }, []);
  const fetchChannels = async () => {
    try {
      const response = await axios.get("/api/channels");
      setChannels(response.data.filter((channel) => channel.type === 0 || channel.type === 5));
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };
  const fetchTemplates = async () => {
    try {
      const response = await axios.get("/api/templates");
      setTemplates(response.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };
  const groupedChannels = channels.reduce((acc, channel) => {
    if (!channel.parent) {
      const noCategoryGroup = acc.find((g) => g.id === "no-category");
      if (noCategoryGroup) {
        noCategoryGroup.channels.push(channel);
      } else {
        acc.push({
          id: "no-category",
          name: "No Category",
          channels: [channel]
        });
      }
    } else {
      const categoryGroup = acc.find((g) => g.id === channel.parent?.id);
      if (categoryGroup) {
        categoryGroup.channels.push(channel);
      } else {
        acc.push({
          id: channel.parent.id,
          name: channel.parent.name,
          channels: [channel]
        });
      }
    }
    return acc;
  }, []);
  const sortedGroups = groupedChannels.sort((a, b) => {
    if (a.id === "no-category") return -1;
    if (b.id === "no-category") return 1;
    return a.name.localeCompare(b.name);
  }).map((group) => ({
    ...group,
    channels: group.channels.sort((a, b) => a.name.localeCompare(b.name))
  }));
  const handleChange = (path, value) => {
    const keys = path.split(".");
    setEmbed((prev) => {
      const newEmbed = { ...prev };
      let current = newEmbed;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newEmbed;
    });
  };
  const addField = () => {
    setEmbed((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: "", value: "", inline: false }]
    }));
  };
  const removeField = (index) => {
    setEmbed((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };
  const handleFieldChange = (index, key, value) => {
    setEmbed((prev) => ({
      ...prev,
      fields: prev.fields.map(
        (field, i) => i === index ? { ...field, [key]: value } : field
      )
    }));
  };
  const addLinkButton = () => {
    const newButton = {
      label: "",
      url: "",
      emoji: ""
    };
    setEmbed((prev) => ({
      ...prev,
      linkButtons: [...prev.linkButtons, newButton]
    }));
  };
  const removeLinkButton = (index) => {
    setEmbed((prev) => ({
      ...prev,
      linkButtons: prev.linkButtons.filter((_, i) => i !== index)
    }));
  };
  const handleLinkButtonChange = (index, field, value) => {
    setEmbed((prev) => ({
      ...prev,
      linkButtons: prev.linkButtons.map(
        (button, i) => i === index ? { ...button, [field]: value } : button
      )
    }));
  };
  const handleSend = async () => {
    if (!selectedChannel) {
      toast.error("Please select a channel");
      return;
    }
    if (!embed.title.trim() && !embed.description.trim()) {
      toast.error("Your embed must have at least a title or description");
      return;
    }
    setIsSending(true);
    let discordEmbed = {
      title: embed.title.trim() || void 0,
      description: embed.description.trim() || void 0,
      color: parseInt(embed.color.replace("#", ""), 16),
      author: embed.author.name.trim() ? {
        name: embed.author.name.trim(),
        icon_url: embed.author.icon_url.trim() || void 0
      } : void 0,
      thumbnail: embed.thumbnail.trim() ? { url: embed.thumbnail.trim() } : null,
      image: embed.image.trim() ? { url: embed.image.trim() } : null,
      footer: embed.footer.text.trim() ? {
        text: embed.footer.text.trim(),
        icon_url: embed.footer.icon_url.trim() || void 0
      } : void 0,
      fields: embed.fields.length > 0 ? embed.fields.filter(
        (field) => field.name.trim() !== "" && field.value.trim() !== ""
      ) : void 0
    };
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/channels/${selectedChannel}/messages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        },
        body: JSON.stringify({
          embeds: [discordEmbed],
          linkButtons: embed.linkButtons.filter(
            (button) => button.label.trim() !== "" && button.url.trim() !== ""
          )
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send embed");
      }
      toast.success("Embed sent successfully! \u{1F680}");
    } catch (error) {
      console.error("Error sending embed:", error);
      if (error.message.includes("BASE_TYPE_REQUIRED")) {
        toast.error("Your embed must have at least a title or description");
      } else {
        toast.error(error.message || "Failed to send embed");
      }
    } finally {
      setIsSending(false);
    }
  };
  const handleAddComponent = (type) => {
    setActiveComponents((prev) => [...prev, type]);
  };
  const handleRemoveComponent = (type) => {
    setActiveComponents((prev) => prev.filter((t) => t !== type));
    setEmbed((prev) => {
      const newEmbed = { ...prev };
      switch (type) {
        case "title":
          newEmbed.title = "";
          break;
        case "description":
          newEmbed.description = "";
          break;
        case "color":
          newEmbed.color = "#000000";
          break;
        case "author":
          newEmbed.author = { name: "", icon_url: "" };
          break;
        case "fields":
          newEmbed.fields = [];
          break;
        case "footer":
          newEmbed.footer = { text: "", icon_url: "" };
          break;
        case "image":
          newEmbed.image = "";
          break;
        case "thumbnail":
          newEmbed.thumbnail = "";
          break;
        case "linkButtons":
          newEmbed.linkButtons = [];
          break;
      }
      return newEmbed;
    });
  };
  const handleSaveTemplate = async () => {
    if (!embed.title.trim() && !embed.description.trim()) {
      toast.error("Please add at least a title or description before saving the template");
      return;
    }
    try {
      const name = prompt("Enter a name for this template:");
      if (!name) return;
      const existingTemplate = templates.find((t) => t.name === name);
      if (existingTemplate) {
        if (!confirm("A template with this name already exists. Do you want to overwrite it?")) {
          return;
        }
      }
      const embedData = {
        title: embed.title.trim() || void 0,
        description: embed.description.trim() || void 0,
        color: embed.color ? parseInt(embed.color.replace("#", ""), 16) : void 0,
        author: embed.author.name.trim() ? {
          name: embed.author.name.trim(),
          icon_url: embed.author.icon_url.trim() || void 0
        } : void 0,
        thumbnail: embed.thumbnail.trim() ? {
          url: embed.thumbnail.trim()
        } : void 0,
        image: embed.image.trim() ? {
          url: embed.image.trim()
        } : void 0,
        footer: embed.footer.text.trim() ? {
          text: embed.footer.text.trim(),
          icon_url: embed.footer.icon_url.trim() || void 0
        } : void 0,
        fields: embed.fields.length > 0 ? embed.fields.filter(
          (field) => field.name.trim() !== "" && field.value.trim() !== ""
        ).map((field) => ({
          name: field.name.trim(),
          value: field.value.trim(),
          inline: field.inline
        })) : void 0
      };
      const linkButtons = embed.linkButtons.filter(
        (button) => button.label.trim() !== "" && button.url.trim() !== ""
      ).map((button) => ({
        label: button.label.trim(),
        url: button.url.trim(),
        emoji: button.emoji?.trim() || void 0
      }));
      const response = await axios.post("/api/templates", {
        name,
        embedData,
        linkButtons
      });
      await fetchTemplates();
      toast.success("Template saved successfully! \u{1F4BE}");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save template. Please try again.");
    }
  };
  const handleLoadTemplate = async (templateId) => {
    try {
      const template = templates.find((t) => t._id === templateId);
      if (!template) return;
      const newEmbed = {
        title: template.embedData.title || "",
        description: template.embedData.description || "",
        color: template.embedData.color ? `#${template.embedData.color.toString(16).padStart(6, "0")}` : "#000000",
        author: {
          name: template.embedData.author?.name || "",
          icon_url: template.embedData.author?.icon_url || ""
        },
        thumbnail: typeof template.embedData.thumbnail === "object" ? template.embedData.thumbnail.url || "" : template.embedData.thumbnail || "",
        image: typeof template.embedData.image === "object" ? template.embedData.image.url || "" : template.embedData.image || "",
        footer: {
          text: template.embedData.footer?.text || "",
          icon_url: template.embedData.footer?.icon_url || ""
        },
        fields: template.embedData.fields || [],
        linkButtons: template.linkButtons || []
      };
      const newComponents = [];
      if (template.embedData.title) newComponents.push("title");
      if (template.embedData.description) newComponents.push("description");
      if (template.embedData.color) newComponents.push("color");
      if (template.embedData.author?.name) newComponents.push("author");
      if (template.embedData.fields && template.embedData.fields.length > 0) newComponents.push("fields");
      if (template.embedData.footer?.text) newComponents.push("footer");
      if (template.embedData.image) newComponents.push("image");
      if (template.embedData.thumbnail) newComponents.push("thumbnail");
      if (template.linkButtons && template.linkButtons.length > 0) newComponents.push("linkButtons");
      setActiveComponents(newComponents);
      setEmbed(newEmbed);
    } catch (error) {
      console.error("Error loading template:", error);
      alert("Failed to load template. Please try again.");
    }
  };
  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await axios.delete(`/api/templates/${templateId}`);
      await fetchTemplates();
      toast.success("Template deleted successfully! \u{1F5D1}\uFE0F");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-card/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground", children: "Discord Embed Builder" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create and customize Discord embeds with a live preview. Send them directly to any text channel in your server." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsTemplatesModalOpen(true),
              className: "flex items-center space-x-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faBookmark, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Templates" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleSaveTemplate,
              className: "flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSave, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Save" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedChannel,
            onChange: (e) => setSelectedChannel(e.target.value),
            className: "w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 appearance-none hover:bg-secondary/80 cursor-pointer font-medium",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", className: "bg-secondary text-muted-foreground", children: "Select a channel..." }),
              sortedGroups.map((group) => /* @__PURE__ */ jsx(
                "optgroup",
                {
                  label: group.name,
                  className: "bg-secondary font-medium text-foreground",
                  children: group.channels.map((channel) => {
                    let channelIcon = "\u{1F4AC}";
                    if (channel.type === 5) {
                      channelIcon = "\u{1F4E2}";
                    } else if (channel.type === 2) {
                      channelIcon = "\u{1F50A}";
                    }
                    return /* @__PURE__ */ jsxs(
                      "option",
                      {
                        value: channel.id,
                        className: "bg-secondary text-foreground py-2",
                        children: [
                          channelIcon,
                          " ",
                          channel.name
                        ]
                      },
                      channel.id
                    );
                  })
                },
                group.id
              ))
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faHashtag, className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronDown, className: "w-4 h-4 text-primary" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 xl:col-span-8 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground", children: "Components" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Add and customize your embed components" })
          ] }) }),
          /* @__PURE__ */ jsx(
            ComponentSelector,
            {
              onSelect: handleAddComponent,
              activeComponents
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: activeComponents.map((type) => {
          switch (type) {
            case "title":
              return /* @__PURE__ */ jsx(
                TitleComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("title")
                },
                type
              );
            case "description":
              return /* @__PURE__ */ jsx(
                DescriptionComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("description")
                },
                type
              );
            case "color":
              return /* @__PURE__ */ jsx(
                ColorComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("color")
                },
                type
              );
            case "author":
              return /* @__PURE__ */ jsx(
                AuthorComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("author")
                },
                type
              );
            case "fields":
              return /* @__PURE__ */ jsx(
                FieldsComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("fields"),
                  addField,
                  removeField,
                  handleFieldChange
                },
                type
              );
            case "footer":
              return /* @__PURE__ */ jsx(
                FooterComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("footer")
                },
                type
              );
            case "image":
              return /* @__PURE__ */ jsx(
                ImageComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("image")
                },
                type
              );
            case "thumbnail":
              return /* @__PURE__ */ jsx(
                ThumbnailComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("thumbnail")
                },
                type
              );
            case "linkButtons":
              return /* @__PURE__ */ jsx(
                LinkButtonsComponent,
                {
                  embed,
                  handleChange,
                  onRemove: () => handleRemoveComponent("linkButtons"),
                  addLinkButton,
                  removeLinkButton,
                  handleLinkButtonChange
                },
                type
              );
            default:
              return null;
          }
        }) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSend,
            disabled: !selectedChannel || isSending,
            className: "w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              isSending ? /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }) : /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPaperPlane, className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: isSending ? "Sending..." : "Send Embed" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 xl:col-span-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground", children: "Preview" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Live preview of your embed" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#313338] rounded-lg p-4 shadow-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-medium", children: "B" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-white font-medium", children: "Bot" }),
              /* @__PURE__ */ jsxs("div", { className: "text-[#989AA2] text-xs", children: [
                "Today at ",
                (/* @__PURE__ */ new Date()).toLocaleTimeString()
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-1 rounded-l-md", style: { backgroundColor: embed.color || "#000000" } }),
              /* @__PURE__ */ jsx("div", { className: "flex-grow min-w-0 bg-[#2B2D31] rounded-r-md overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-4 flex", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-grow min-w-0 pr-4", children: [
                  embed.author.name && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [
                    embed.author.icon_url && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: embed.author.icon_url,
                        alt: "",
                        className: "w-6 h-6 rounded-full"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[#ffffff] text-sm font-medium truncate", children: embed.author.name })
                  ] }),
                  embed.title && /* @__PURE__ */ jsx("h4", { className: "text-[#00a8fc] font-semibold mb-1 hover:underline cursor-pointer", children: embed.title }),
                  embed.description && /* @__PURE__ */ jsx("div", { className: "text-[#dbdee1] text-[0.95rem] leading-[1.375rem] break-words", children: embed.description.split("\n").map((line, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
                    renderMarkdown(line),
                    i < embed.description.split("\n").length - 1 && /* @__PURE__ */ jsx("br", {})
                  ] }, i)) }),
                  embed.fields.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2", children: embed.fields.map((field, index) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: field.inline ? "col-span-1" : "col-span-full",
                      children: [
                        /* @__PURE__ */ jsx("h5", { className: "text-[#ffffff] font-semibold text-sm mb-[2px]", children: renderMarkdown(field.name) }),
                        /* @__PURE__ */ jsx("div", { className: "text-[#dbdee1] text-sm break-words", children: renderMarkdown(field.value) })
                      ]
                    },
                    index
                  )) }),
                  embed.image && /* @__PURE__ */ jsx("div", { className: "mt-4 max-w-full", children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: embed.image,
                      alt: "",
                      className: "rounded-md max-h-[300px] object-contain"
                    }
                  ) }),
                  embed.footer.text && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mt-2 pt-2", children: [
                    embed.footer.icon_url && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: embed.footer.icon_url,
                        alt: "",
                        className: "w-5 h-5 rounded-full"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[#989AA2] text-sm", children: embed.footer.text })
                  ] })
                ] }),
                embed.thumbnail && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 ml-4", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: embed.thumbnail,
                    alt: "",
                    className: "w-20 h-20 rounded-md object-cover"
                  }
                ) })
              ] }) })
            ] }),
            embed.linkButtons.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: embed.linkButtons.map((button, index) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: button.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center space-x-2 px-4 py-2 bg-[#4E505D] hover:bg-[#6D6F7B] rounded text-sm font-medium text-white transition-colors",
                children: [
                  button.emoji && /* @__PURE__ */ jsx("span", { children: button.emoji }),
                  /* @__PURE__ */ jsx("span", { children: button.label })
                ]
              },
              index
            )) })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      TemplatesModal,
      {
        isOpen: isTemplatesModalOpen,
        onClose: () => setIsTemplatesModalOpen(false),
        templates,
        onLoadTemplate: handleLoadTemplate,
        onDeleteTemplate: handleDeleteTemplate
      }
    )
  ] });
};
var stdin_default = EmbedBuilder;
export {
  stdin_default as default
};
