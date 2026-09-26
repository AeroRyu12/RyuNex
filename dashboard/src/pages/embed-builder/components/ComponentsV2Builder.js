import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faLayerGroup,
  faFont,
  faImage,
  faMinus,
  faFile,
  faSquare,
  faTrash,
  faGripVertical,
  faPlus,
  faChevronDown,
  faPaperPlane,
  faHashtag,
  faCopy,
  faCode,
  faSave,
  faFolderOpen,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "../../../components/ui/Toast";
const componentDefinitions = [
  {
    type: "container",
    label: "Container",
    icon: faBox,
    description: "A container that holds other components",
    defaultProperties: { accent_color: null, spoiler: false },
    canHaveChildren: true
  },
  {
    type: "section",
    label: "Section",
    icon: faLayerGroup,
    description: "A section with text and optional accessory",
    defaultProperties: {
      text: { content: "" },
      accessory: null
    }
  },
  {
    type: "text_display",
    label: "Text Display",
    icon: faFont,
    description: "Rich text content display",
    defaultProperties: { content: "" }
  },
  {
    type: "media_gallery",
    label: "Media Gallery",
    icon: faImage,
    description: "Display up to 10 media items",
    defaultProperties: { items: [] }
  },
  {
    type: "separator",
    label: "Separator",
    icon: faMinus,
    description: "Visual divider between components",
    defaultProperties: { divider: true, spacing: "small" }
  },
  {
    type: "file",
    label: "File",
    icon: faFile,
    description: "File attachment display",
    defaultProperties: { file: { url: "", filename: "" }, spoiler: false }
  },
  {
    type: "button",
    label: "Link Button",
    icon: faSquare,
    description: "Button that opens a URL",
    defaultProperties: {
      style: "link",
      label: "Click Here",
      url: "",
      disabled: false
    }
  }
];
const generateId = () => `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const ComponentsV2Builder = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [templates, setTemplates] = useState([]);
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
      const response = await axios.get("/api/templates/v2");
      setTemplates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    }
  };
  const handleSaveTemplate = async () => {
    if (components.length === 0) {
      toast.error("Add at least one component before saving");
      return;
    }
    const name = prompt("Enter a name for this template:");
    if (!name?.trim()) return;
    const existingTemplate = templates.find((t) => t.name === name);
    if (existingTemplate) {
      if (!confirm("A template with this name exists. Overwrite it?")) return;
    }
    try {
      await axios.post("/api/templates/v2", { name, components });
      await fetchTemplates();
      toast.success("Template saved! \u{1F4BE}");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save template");
    }
  };
  const handleLoadTemplate = (template) => {
    const regenerateIds = (comps2) => {
      return comps2.map((comp) => ({
        ...comp,
        id: generateId(),
        children: comp.children ? regenerateIds(comp.children) : void 0
      }));
    };
    const comps = Array.isArray(template.components) ? template.components : [];
    setComponents(regenerateIds(comps));
    setSelectedComponent(null);
    setSelectedChildId(null);
    setIsTemplatesModalOpen(false);
    toast.success(`Loaded "${template.name}"`);
  };
  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Delete this template?")) return;
    try {
      await axios.delete(`/api/templates/v2/${templateId}`);
      await fetchTemplates();
      toast.success("Template deleted");
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };
  const handleImportJson = () => {
    const json = prompt("Paste your JSON:");
    if (!json?.trim()) return;
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        const regenerateIds = (comps) => {
          return comps.map((comp) => ({
            ...comp,
            id: generateId(),
            children: comp.children ? regenerateIds(comp.children) : void 0
          }));
        };
        setComponents(regenerateIds(parsed));
        toast.success("Components imported!");
      } else {
        toast.error("Invalid format - expected array of components");
      }
    } catch (e) {
      toast.error("Invalid JSON");
    }
  };
  const groupedChannels = channels.reduce((acc, channel) => {
    if (!channel.parent) {
      const noCategoryGroup = acc.find((g) => g.id === "no-category");
      if (noCategoryGroup) {
        noCategoryGroup.channels.push(channel);
      } else {
        acc.push({ id: "no-category", name: "No Category", channels: [channel] });
      }
    } else {
      const categoryGroup = acc.find((g) => g.id === channel.parent?.id);
      if (categoryGroup) {
        categoryGroup.channels.push(channel);
      } else {
        acc.push({ id: channel.parent.id, name: channel.parent.name, channels: [channel] });
      }
    }
    return acc;
  }, []);
  const addComponent = (type) => {
    const definition = componentDefinitions.find((d) => d.type === type);
    if (!definition) return;
    const newComponent = {
      id: generateId(),
      type,
      properties: { ...definition.defaultProperties },
      children: definition.canHaveChildren ? [] : void 0
    };
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };
  const removeComponent = (id) => {
    setComponents(components.filter((c) => c.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
      setSelectedChildId(null);
    }
  };
  const duplicateComponent = (id) => {
    const component = components.find((c) => c.id === id);
    if (!component) return;
    const duplicated = {
      ...component,
      id: generateId(),
      properties: { ...component.properties },
      children: component.children ? [...component.children] : void 0
    };
    const index = components.findIndex((c) => c.id === id);
    const newComponents = [...components];
    newComponents.splice(index + 1, 0, duplicated);
    setComponents(newComponents);
  };
  const updateComponentProperty = (id, path, value) => {
    setComponents(components.map((c) => {
      if (c.id !== id) return c;
      if (path === "_children") {
        return { ...c, children: value };
      }
      const keys = path.split(".");
      const newProperties = { ...c.properties };
      let current = newProperties;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { ...c, properties: newProperties };
    }));
  };
  const getSelectedComponentData = () => {
    return components.find((c) => c.id === selectedComponent);
  };
  const generateDiscordPayload = () => {
    const convertComponent = (comp) => {
      switch (comp.type) {
        case "container":
          return {
            type: 17,
            accent_color: comp.properties.accent_color,
            spoiler: comp.properties.spoiler,
            components: comp.children?.map(convertComponent) || []
          };
        case "section":
          return {
            type: 9,
            components: [
              { type: 10, content: comp.properties.text?.content || "" }
            ],
            accessory: comp.properties.accessory
          };
        case "text_display":
          return {
            type: 10,
            content: comp.properties.content || ""
          };
        case "media_gallery":
          return {
            type: 12,
            items: comp.properties.items || []
          };
        case "separator":
          return {
            type: 14,
            divider: comp.properties.divider,
            spacing: comp.properties.spacing === "large" ? 2 : 1
          };
        case "file":
          return {
            type: 13,
            file: comp.properties.file,
            spoiler: comp.properties.spoiler
          };
        case "button":
          return {
            type: 2,
            style: 5,
            label: comp.properties.label,
            url: comp.properties.url || void 0,
            disabled: comp.properties.disabled
          };
        default:
          return null;
      }
    };
    return {
      flags: 32768,
      components: components.map(convertComponent).filter(Boolean)
    };
  };
  const validateComponents = (comps) => {
    for (const comp of comps) {
      if (comp.type === "media_gallery" && comp.properties.items) {
        for (const item of comp.properties.items) {
          const url = item.media?.url || "";
          if (url.startsWith("data:")) {
            return "Media Gallery contains a base64 image. Discord requires hosted image URLs (e.g., https://i.imgur.com/example.png). Please upload your image to an image host first.";
          }
          if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
            return "Media Gallery contains an invalid URL. URLs must start with http:// or https://";
          }
        }
      }
      if (comp.type === "button" && comp.properties.url) {
        const url = comp.properties.url;
        if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
          return "Button URL must start with http:// or https://";
        }
      }
      if (comp.children) {
        const childError = validateComponents(comp.children);
        if (childError) return childError;
      }
    }
    return null;
  };
  const handleSend = async () => {
    if (!selectedChannel) {
      toast.error("Please select a channel");
      return;
    }
    if (components.length === 0) {
      toast.error("Please add at least one component");
      return;
    }
    const validationError = validateComponents(components);
    if (validationError) {
      toast.error(validationError, { duration: 6e3 });
      return;
    }
    setIsSending(true);
    try {
      const payload = generateDiscordPayload();
      const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];
      const response = await fetch(`/api/channels/${selectedChannel}/messages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": decodeURIComponent(csrfToken) }
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }
      toast.success("Components V2 message sent! \u{1F680}");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };
  const copyJson = () => {
    const payload = generateDiscordPayload();
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success("JSON copied to clipboard!");
  };
  const selectedData = getSelectedComponentData();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground", children: "Components V2 Builder" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Build advanced Discord messages with drag-and-drop components" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsTemplatesModalOpen(true),
              className: "flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFolderOpen, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Templates" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleSaveTemplate,
              className: "flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSave, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Save" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleImportJson,
              className: "flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCode, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Import" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowJson(!showJson),
              className: "flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCode, className: "w-4 h-4" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  showJson ? "Hide" : "Show",
                  " JSON"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: copyJson,
              className: "flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCopy, className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "Copy" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mb-6", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedChannel,
            onChange: (e) => setSelectedChannel(e.target.value),
            className: "w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 appearance-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a channel..." }),
              groupedChannels.map((group) => /* @__PURE__ */ jsx("optgroup", { label: group.name, children: group.channels.map((channel) => /* @__PURE__ */ jsxs("option", { value: channel.id, children: [
                channel.type === 5 ? "\u{1F4E2}" : "\u{1F4AC}",
                " ",
                channel.name
              ] }, channel.id)) }, group.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faHashtag, className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChevronDown, className: "w-4 h-4 text-primary" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "xl:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-4 sticky top-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground mb-4 uppercase tracking-wider", children: "Components" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: componentDefinitions.map((def) => /* @__PURE__ */ jsxs(
          motion.button,
          {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => addComponent(def.type),
            className: "w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 transition-all text-left group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: def.icon, className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: def.label }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: def.description })
              ] }),
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" })
            ]
          },
          def.type
        )) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "xl:col-span-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground mb-4 uppercase tracking-wider", children: "Canvas" }),
          components.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-border rounded-xl p-12 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLayerGroup, className: "w-6 h-6 text-muted-foreground" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-2", children: "No components added yet" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/60", children: "Click a component from the left panel to add it" })
          ] }) : /* @__PURE__ */ jsx(
            Reorder.Group,
            {
              axis: "y",
              values: components,
              onReorder: setComponents,
              className: "space-y-2",
              children: /* @__PURE__ */ jsx(AnimatePresence, { children: components.map((component) => {
                const def = componentDefinitions.find((d) => d.type === component.type);
                const isSelected = selectedComponent === component.id && !selectedChildId;
                const isContainer = component.type === "container";
                return /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs(
                    Reorder.Item,
                    {
                      value: component,
                      className: `flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? "bg-primary/10 border-primary/50" : "bg-secondary/30 border-border hover:border-primary/30"}`,
                      onClick: () => {
                        setSelectedComponent(component.id);
                        setSelectedChildId(null);
                      },
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faGripVertical, className: "w-4 h-4" }) }),
                        /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`, children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: def?.icon || faBox, className: "w-3.5 h-3.5" }) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: def?.label }),
                            isSelected && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-medium", children: "EDITING" })
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: component.type === "text_display" && component.properties.content ? component.properties.content.substring(0, 40) + (component.properties.content.length > 40 ? "..." : "") : component.type === "button" ? `Button: ${component.properties.label || "Untitled"}` : component.type === "section" && component.properties.text?.content ? component.properties.text.content.substring(0, 40) + (component.properties.text.content.length > 40 ? "..." : "") : component.type === "container" ? `${component.children?.length || 0} child components` : component.type === "media_gallery" ? `${component.properties.items?.length || 0} media items` : component.type === "separator" ? `${component.properties.spacing || "small"} spacing` : component.type === "file" && component.properties.file?.filename ? component.properties.file.filename : "Click to edit \u2192" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                duplicateComponent(component.id);
                              },
                              className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                              title: "Duplicate",
                              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faCopy, className: "w-3.5 h-3.5" })
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                removeComponent(component.id);
                              },
                              className: "p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors",
                              title: "Remove",
                              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3.5 h-3.5" })
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  isContainer && component.children && component.children.length > 0 && /* @__PURE__ */ jsx("div", { className: "ml-6 mt-1 space-y-1 border-l-2 border-primary/20 pl-3", children: component.children.map((child, childIndex) => {
                    const childDef = componentDefinitions.find((d) => d.type === child.type);
                    const isChildSelected = selectedComponent === component.id && selectedChildId === child.id;
                    return /* @__PURE__ */ jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 },
                        className: `flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${isChildSelected ? "bg-primary/10 border-primary/50" : "bg-secondary/20 border-border/50 hover:border-primary/30"}`,
                        onClick: (e) => {
                          e.stopPropagation();
                          setSelectedComponent(component.id);
                          setSelectedChildId(child.id);
                        },
                        children: [
                          /* @__PURE__ */ jsx("div", { className: `w-6 h-6 rounded-md flex items-center justify-center ${isChildSelected ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground"}`, children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: childDef?.icon || faBox, className: "w-3 h-3" }) }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-foreground", children: childDef?.label }),
                              isChildSelected && /* @__PURE__ */ jsx("span", { className: "text-[9px] px-1 py-0.5 bg-primary/20 text-primary rounded font-medium", children: "EDITING" })
                            ] }),
                            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: child.type === "text_display" && child.properties.content ? child.properties.content.substring(0, 25) + "..." : child.type === "button" ? child.properties.label || "Link" : child.type === "section" && child.properties.text?.content ? child.properties.text.content.substring(0, 25) + "..." : "Click to edit" })
                          ] }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                const newChildren = component.children?.filter((_, i) => i !== childIndex) || [];
                                setComponents(components.map(
                                  (c) => c.id === component.id ? { ...c, children: newChildren } : c
                                ));
                                if (selectedChildId === child.id) {
                                  setSelectedChildId(null);
                                }
                              },
                              className: "p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors",
                              title: "Remove",
                              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3 h-3" })
                            }
                          )
                        ]
                      },
                      child.id
                    );
                  }) })
                ] }, component.id);
              }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSend,
            disabled: !selectedChannel || isSending || components.length === 0,
            className: "w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              isSending ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPaperPlane, className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: isSending ? "Sending..." : "Send Message" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "xl:col-span-4", children: /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-4 sticky top-4", children: [
        (() => {
          const parentComponent = selectedData;
          const childComponent = parentComponent && selectedChildId ? parentComponent.children?.find((c) => c.id === selectedChildId) : null;
          const isEditing = parentComponent && !selectedChildId || childComponent;
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground uppercase tracking-wider", children: isEditing ? "Edit Properties" : "Live Preview" }),
                childComponent && /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded", children: "Child" })
              ] }),
              isEditing && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    if (selectedChildId) {
                      setSelectedChildId(null);
                    } else {
                      setSelectedComponent(null);
                    }
                  },
                  className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                  children: selectedChildId ? "\u2190 Back to Container" : "Show Preview \u2192"
                }
              )
            ] }),
            childComponent ? /* @__PURE__ */ jsx(
              ChildPropertyEditor,
              {
                child: childComponent,
                parentId: parentComponent.id,
                childIndex: parentComponent.children?.findIndex((c) => c.id === selectedChildId) || 0,
                onUpdate: (newChild) => {
                  setComponents(components.map((c) => {
                    if (c.id !== parentComponent.id) return c;
                    const newChildren = c.children?.map(
                      (child) => child.id === selectedChildId ? newChild : child
                    ) || [];
                    return { ...c, children: newChildren };
                  }));
                }
              }
            ) : parentComponent ? /* @__PURE__ */ jsx(
              ComponentPropertyEditor,
              {
                component: parentComponent,
                onUpdate: (path, value) => updateComponentProperty(parentComponent.id, path, value)
              }
            ) : components.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-2", children: "No components yet" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60", children: "Add components from the left panel, then click them to edit" })
            ] }) : /* @__PURE__ */ jsx(ComponentsV2Preview, { components })
          ] });
        })(),
        showJson && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground mb-2 uppercase", children: "JSON Output" }),
          /* @__PURE__ */ jsx("pre", { className: "bg-[#1a1a2e] rounded-lg p-3 text-xs text-green-400 overflow-auto max-h-64 font-mono", children: JSON.stringify(generateDiscordPayload(), null, 2) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isTemplatesModalOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50",
        onClick: () => setIsTemplatesModalOpen(false),
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            className: "glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground", children: "V2 Templates" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Load or manage saved component layouts" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setIsTemplatesModalOpen(false),
                    className: "p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors",
                    children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: templates && templates.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: templates.map((template) => {
                const comps = Array.isArray(template.components) ? template.components : [];
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "bg-secondary/50 border border-border rounded-xl p-4 hover:border-primary/30 transition-colors",
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsx("h3", { className: "font-medium text-foreground", children: template.name }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                          comps.length,
                          " component",
                          comps.length !== 1 ? "s" : "",
                          " \u2022 Updated ",
                          new Date(template.updatedAt).toLocaleDateString()
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
                          comps.slice(0, 5).map((comp, i) => {
                            const def = componentDefinitions.find((d) => d.type === comp.type);
                            return /* @__PURE__ */ jsx("span", { className: "text-[10px] px-2 py-0.5 bg-secondary rounded text-muted-foreground", children: def?.label || comp.type }, i);
                          }),
                          comps.length > 5 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] px-2 py-0.5 bg-secondary rounded text-muted-foreground", children: [
                            "+",
                            comps.length - 5,
                            " more"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-4", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleLoadTemplate(template),
                            className: "px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/80 transition-colors",
                            children: "Load"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleDeleteTemplate(template._id),
                            className: "p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors",
                            children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
                          }
                        )
                      ] })
                    ] })
                  },
                  template._id
                );
              }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFolderOpen, className: "w-12 h-12 text-muted-foreground/30 mb-4" }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No Templates Yet" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Create a component layout and click Save to store it as a template" })
              ] }) })
            ]
          }
        )
      }
    ) })
  ] });
};
const ComponentPropertyEditor = ({ component, onUpdate }) => {
  const renderEditor = () => {
    switch (component.type) {
      case "text_display":
        return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Content" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: component.properties.content || "",
              onChange: (e) => onUpdate("content", e.target.value),
              placeholder: "Enter your text content... (supports markdown)",
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-y"
            }
          )
        ] }) });
      case "section":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Text Content" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: component.properties.text?.content || "",
                onChange: (e) => onUpdate("text.content", e.target.value),
                placeholder: "Section text content...",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Accessory Type" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: component.properties.accessory?.type || "none",
                onChange: (e) => {
                  if (e.target.value === "none") {
                    onUpdate("accessory", null);
                  } else if (e.target.value === "thumbnail") {
                    onUpdate("accessory", { type: 11, media: { url: "" } });
                  } else if (e.target.value === "button") {
                    onUpdate("accessory", { type: 2, style: 1, label: "Button" });
                  }
                },
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "none", children: "No Accessory" }),
                  /* @__PURE__ */ jsx("option", { value: "thumbnail", children: "Thumbnail" }),
                  /* @__PURE__ */ jsx("option", { value: "button", children: "Button" })
                ]
              }
            )
          ] })
        ] });
      case "container":
        const childTypes = ["text_display", "section", "media_gallery", "separator", "button"];
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Accent Color" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "color",
                  value: component.properties.accent_color ? `#${component.properties.accent_color.toString(16).padStart(6, "0")}` : "#5865F2",
                  onChange: (e) => onUpdate("accent_color", parseInt(e.target.value.slice(1), 16)),
                  className: "w-10 h-10 rounded-lg border border-border cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: component.properties.accent_color ? `#${component.properties.accent_color.toString(16).padStart(6, "0")}` : "#5865F2",
                  onChange: (e) => {
                    const hex = e.target.value.replace("#", "");
                    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                      onUpdate("accent_color", parseInt(hex, 16));
                    }
                  },
                  className: "flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "spoiler",
                checked: component.properties.spoiler || false,
                onChange: (e) => onUpdate("spoiler", e.target.checked),
                className: "w-4 h-4 rounded border-border text-primary focus:ring-primary"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "spoiler", className: "text-sm text-foreground", children: "Spoiler (blur content)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-3", children: "Container Contents" }),
            (component.children || []).length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-3", children: component.children?.map((child, index) => {
              const childDef = componentDefinitions.find((d) => d.type === child.type);
              return /* @__PURE__ */ jsxs("div", { className: "border border-border rounded-lg overflow-hidden", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 bg-secondary/50", children: [
                  /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: childDef?.icon || faBox, className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm font-medium text-foreground", children: childDef?.label }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => {
                        const newChildren = component.children?.filter((_, i) => i !== index) || [];
                        onUpdate("_children", newChildren);
                      },
                      className: "p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors",
                      title: "Remove",
                      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3 h-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-secondary/20", children: /* @__PURE__ */ jsx(
                  ChildComponentEditor,
                  {
                    child,
                    onUpdate: (path, value) => {
                      const newChildren = [...component.children || []];
                      if (path.startsWith("properties.")) {
                        const propPath = path.replace("properties.", "");
                        const keys = propPath.split(".");
                        const newProps = { ...child.properties };
                        let current = newProps;
                        for (let i = 0; i < keys.length - 1; i++) {
                          current[keys[i]] = { ...current[keys[i]] };
                          current = current[keys[i]];
                        }
                        current[keys[keys.length - 1]] = value;
                        newChildren[index] = { ...child, properties: newProps };
                      }
                      onUpdate("_children", newChildren);
                    }
                  }
                ) })
              ] }, child.id);
            }) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "No components inside container. Add one below:" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: childTypes.map((type) => {
              const childDef = componentDefinitions.find((d) => d.type === type);
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    const newChild = {
                      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                      type,
                      properties: { ...childDef?.defaultProperties }
                    };
                    const newChildren = [...component.children || [], newChild];
                    onUpdate("_children", newChildren);
                  },
                  className: "flex items-center gap-2 p-2 bg-secondary/30 hover:bg-secondary border border-border hover:border-primary/30 rounded-lg text-left transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: childDef?.icon || faBox, className: "w-3 h-3 text-primary" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-foreground", children: [
                      "+ ",
                      childDef?.label
                    ] })
                  ]
                },
                type
              );
            }) })
          ] })
        ] });
      case "media_gallery":
        return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Media Items" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Use hosted image URLs (e.g., imgur.com). Base64/pasted images won't work." }),
          (component.properties.items || []).map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: item.media?.url || "",
                onChange: (e) => {
                  const newItems = [...component.properties.items || []];
                  newItems[index] = { media: { url: e.target.value } };
                  onUpdate("items", newItems);
                },
                placeholder: "https://i.imgur.com/example.png",
                className: "flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  const newItems = component.properties.items.filter((_, i) => i !== index);
                  onUpdate("items", newItems);
                },
                className: "p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3.5 h-3.5" })
              }
            )
          ] }, index)),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const newItems = [...component.properties.items || [], { media: { url: "" } }];
                onUpdate("items", newItems);
              },
              className: "w-full flex items-center justify-center gap-2 p-2 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Add Media" })
              ]
            }
          )
        ] }) });
      case "separator":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "divider",
                checked: component.properties.divider !== false,
                onChange: (e) => onUpdate("divider", e.target.checked),
                className: "w-4 h-4 rounded border-border text-primary focus:ring-primary"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "divider", className: "text-sm text-foreground", children: "Show divider line" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Spacing" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: component.properties.spacing || "small",
                onChange: (e) => onUpdate("spacing", e.target.value),
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "small", children: "Small" }),
                  /* @__PURE__ */ jsx("option", { value: "large", children: "Large" })
                ]
              }
            )
          ] })
        ] });
      case "button":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Button Label" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: component.properties.label || "",
                onChange: (e) => onUpdate("label", e.target.value),
                placeholder: "Click Here",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Link URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: component.properties.url || "",
                onChange: (e) => onUpdate("url", e.target.value),
                placeholder: "https://example.com",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The URL that opens when clicked" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "disabled",
                checked: component.properties.disabled || false,
                onChange: (e) => onUpdate("disabled", e.target.checked),
                className: "w-4 h-4 rounded border-border text-primary focus:ring-primary"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "disabled", className: "text-sm text-foreground", children: "Disabled" })
          ] })
        ] });
      case "file":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "File URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: component.properties.file?.url || "",
                onChange: (e) => onUpdate("file.url", e.target.value),
                placeholder: "https://example.com/file.pdf",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Filename" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: component.properties.file?.filename || "",
                onChange: (e) => onUpdate("file.filename", e.target.value),
                placeholder: "document.pdf",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "file-spoiler",
                checked: component.properties.spoiler || false,
                onChange: (e) => onUpdate("spoiler", e.target.checked),
                className: "w-4 h-4 rounded border-border text-primary focus:ring-primary"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "file-spoiler", className: "text-sm text-foreground", children: "Spoiler" })
          ] })
        ] });
      default:
        return /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No properties available for this component type." });
    }
  };
  const def = componentDefinitions.find((d) => d.type === component.type);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pb-4 border-b border-border", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: def?.icon || faBox, className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: def?.label }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: def?.description })
      ] })
    ] }),
    renderEditor()
  ] });
};
const ChildPropertyEditor = ({ child, parentId, childIndex, onUpdate }) => {
  const def = componentDefinitions.find((d) => d.type === child.type);
  const updateProperty = (path, value) => {
    const keys = path.split(".");
    const newProperties = { ...child.properties };
    let current = newProperties;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdate({ ...child, properties: newProperties });
  };
  const renderEditor = () => {
    switch (child.type) {
      case "text_display":
        return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Content" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: child.properties.content || "",
              onChange: (e) => updateProperty("content", e.target.value),
              placeholder: "Enter your text content... (supports markdown)",
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-y"
            }
          )
        ] }) });
      case "section":
        return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Text Content" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: child.properties.text?.content || "",
              onChange: (e) => updateProperty("text.content", e.target.value),
              placeholder: "Section text content...",
              className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y"
            }
          )
        ] }) });
      case "media_gallery":
        return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Media Items" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Use hosted image URLs (e.g., imgur.com). Base64/pasted images won't work." }),
          (child.properties.items || []).map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: item.media?.url || "",
                onChange: (e) => {
                  const newItems = [...child.properties.items || []];
                  newItems[i] = { media: { url: e.target.value } };
                  updateProperty("items", newItems);
                },
                placeholder: "https://i.imgur.com/example.png",
                className: "flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  const newItems = child.properties.items.filter((_, idx) => idx !== i);
                  updateProperty("items", newItems);
                },
                className: "p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3.5 h-3.5" })
              }
            )
          ] }, i)),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const newItems = [...child.properties.items || [], { media: { url: "" } }];
                updateProperty("items", newItems);
              },
              className: "w-full flex items-center justify-center gap-2 p-2 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors",
              children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Add Media" })
              ]
            }
          )
        ] }) });
      case "separator":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "child-divider",
                checked: child.properties.divider !== false,
                onChange: (e) => updateProperty("divider", e.target.checked),
                className: "w-4 h-4 rounded border-border text-primary focus:ring-primary"
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "child-divider", className: "text-sm text-foreground", children: "Show divider line" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Spacing" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: child.properties.spacing || "small",
                onChange: (e) => updateProperty("spacing", e.target.value),
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "small", children: "Small" }),
                  /* @__PURE__ */ jsx("option", { value: "large", children: "Large" })
                ]
              }
            )
          ] })
        ] });
      case "button":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Button Label" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: child.properties.label || "",
                onChange: (e) => updateProperty("label", e.target.value),
                placeholder: "Click Here",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Link URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: child.properties.url || "",
                onChange: (e) => updateProperty("url", e.target.value),
                placeholder: "https://example.com",
                className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The URL that opens when clicked" })
          ] })
        ] });
      default:
        return /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No editor available for this component type." });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pb-4 border-b border-border", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: def?.icon || faBox, className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: def?.label }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Child of Container" })
      ] })
    ] }),
    renderEditor()
  ] });
};
const ChildComponentEditor = ({ child, onUpdate }) => {
  switch (child.type) {
    case "text_display":
      return /* @__PURE__ */ jsx(
        "textarea",
        {
          value: child.properties.content || "",
          onChange: (e) => onUpdate("properties.content", e.target.value),
          placeholder: "Enter text content...",
          className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] resize-y"
        }
      );
    case "section":
      return /* @__PURE__ */ jsx(
        "textarea",
        {
          value: child.properties.text?.content || "",
          onChange: (e) => onUpdate("properties.text.content", e.target.value),
          placeholder: "Section text content...",
          className: "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] resize-y"
        }
      );
    case "media_gallery":
      return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        (child.properties.items || []).map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: item.media?.url || "",
              onChange: (e) => {
                const newItems = [...child.properties.items || []];
                newItems[i] = { media: { url: e.target.value } };
                onUpdate("properties.items", newItems);
              },
              placeholder: "Image URL",
              className: "flex-1 bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const newItems = child.properties.items.filter((_, idx) => idx !== i);
                onUpdate("properties.items", newItems);
              },
              className: "p-1.5 text-red-400 hover:bg-red-500/10 rounded",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3 h-3" })
            }
          )
        ] }, i)),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const newItems = [...child.properties.items || [], { media: { url: "" } }];
              onUpdate("properties.items", newItems);
            },
            className: "w-full p-1.5 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg hover:border-primary/50 transition-colors",
            children: "+ Add Image"
          }
        )
      ] });
    case "separator":
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: child.properties.spacing || "small",
            onChange: (e) => onUpdate("properties.spacing", e.target.value),
            className: "flex-1 bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50",
            children: [
              /* @__PURE__ */ jsx("option", { value: "small", children: "Small spacing" }),
              /* @__PURE__ */ jsx("option", { value: "large", children: "Large spacing" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-xs text-foreground", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: child.properties.divider !== false,
              onChange: (e) => onUpdate("properties.divider", e.target.checked),
              className: "w-3 h-3 rounded"
            }
          ),
          "Line"
        ] })
      ] });
    case "button":
      return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: child.properties.label || "",
            onChange: (e) => onUpdate("properties.label", e.target.value),
            placeholder: "Button label",
            className: "w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: child.properties.url || "",
            onChange: (e) => onUpdate("properties.url", e.target.value),
            placeholder: "https://example.com",
            className: "w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          }
        )
      ] });
    default:
      return /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "No editor available" });
  }
};
const ComponentsV2Preview = ({ components }) => {
  if (components.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Add components to see preview" }) });
  }
  const renderComponent = (comp) => {
    switch (comp.type) {
      case "text_display":
        return /* @__PURE__ */ jsx("div", { className: "text-[#dbdee1] text-sm whitespace-pre-wrap", children: comp.properties.content || "Empty text" }, comp.id);
      case "section":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 text-[#dbdee1] text-sm", children: comp.properties.text?.content || "Empty section" }),
          comp.properties.accessory && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: comp.properties.accessory.type === 11 ? /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded bg-[#4e5058] flex items-center justify-center", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faImage, className: "w-6 h-6 text-[#80848e]" }) }) : /* @__PURE__ */ jsx("button", { className: "px-3 py-1.5 bg-[#5865f2] text-white text-sm rounded", children: comp.properties.accessory.label || "Button" }) })
        ] }, comp.id);
      case "container":
        const accentColor = comp.properties.accent_color ? `#${comp.properties.accent_color.toString(16).padStart(6, "0")}` : "#5865f2";
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "rounded-lg overflow-hidden",
            style: { borderLeft: `4px solid ${accentColor}` },
            children: /* @__PURE__ */ jsx("div", { className: `bg-[#2b2d31] p-3 space-y-2 ${comp.properties.spoiler ? "blur-sm hover:blur-none transition-all" : ""}`, children: comp.children && comp.children.length > 0 ? comp.children.map((child) => renderComponent(child)) : /* @__PURE__ */ jsx("p", { className: "text-[#80848e] text-xs italic", children: "Empty container" }) })
          },
          comp.id
        );
      case "media_gallery":
        return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1", children: (comp.properties.items || []).length > 0 ? comp.properties.items.slice(0, 4).map((item, i) => /* @__PURE__ */ jsx("div", { className: "aspect-video bg-[#4e5058] rounded flex items-center justify-center", children: item.media?.url ? /* @__PURE__ */ jsx("img", { src: item.media.url, alt: "", className: "w-full h-full object-cover rounded" }) : /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faImage, className: "w-6 h-6 text-[#80848e]" }) }, i)) : /* @__PURE__ */ jsx("div", { className: "col-span-2 aspect-video bg-[#4e5058] rounded flex items-center justify-center", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faImage, className: "w-8 h-8 text-[#80848e]" }) }) }, comp.id);
      case "separator":
        return /* @__PURE__ */ jsx("div", { className: `${comp.properties.spacing === "large" ? "py-4" : "py-2"}`, children: comp.properties.divider !== false && /* @__PURE__ */ jsx("div", { className: "border-t border-[#3f4147]" }) }, comp.id);
      case "button":
        return /* @__PURE__ */ jsxs(
          "a",
          {
            href: comp.properties.url || "#",
            target: "_blank",
            rel: "noopener noreferrer",
            className: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-[#4e5058] text-[#00a8fc] hover:underline ${comp.properties.disabled ? "opacity-50 pointer-events-none" : ""}`,
            children: [
              comp.properties.label || "Link",
              /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
            ]
          },
          comp.id
        );
      case "file":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-[#2b2d31] rounded-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-[#4e5058] rounded flex items-center justify-center", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFile, className: "w-5 h-5 text-[#80848e]" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[#00a8fc] text-sm font-medium", children: comp.properties.file?.filename || "file.txt" }),
            /* @__PURE__ */ jsx("p", { className: "text-[#80848e] text-xs", children: "File" })
          ] })
        ] }, comp.id);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#313338] rounded-lg p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-medium", children: "B" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-white font-medium text-sm", children: "Bot" }),
        /* @__PURE__ */ jsxs("div", { className: "text-[#989AA2] text-xs", children: [
          "Today at ",
          (/* @__PURE__ */ new Date()).toLocaleTimeString()
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: components.map(renderComponent) })
  ] });
};
var stdin_default = ComponentsV2Builder;
export {
  stdin_default as default
};
