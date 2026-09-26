import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faTrash, faExternalLinkAlt, faReply, faSmile, faArrowLeft, faCog, faFileAlt, faMousePointer, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import CommandPreview from "./CommandPreview";
import { config } from "../../../config";
const EmojiPicker = ({ emojis, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const filtered = emojis.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  const standardEmojis = filtered.filter((e) => e.isStandard);
  const serverEmojis = filtered.filter((e) => !e.isStandard);
  const getEmojiDisplay = (emoji) => {
    if (emoji.isStandard) return emoji.name;
    return emoji.url ? /* @__PURE__ */ jsx("img", { src: emoji.url, alt: emoji.name, className: "w-5 h-5" }) : /* @__PURE__ */ jsx("img", { src: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`, alt: emoji.name, className: "w-5 h-5" });
  };
  const handleSelect = (emoji) => {
    if (emoji.isStandard) {
      onChange(emoji.name);
    } else {
      onChange(`<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);
    }
    setIsOpen(false);
    setSearch("");
  };
  const getCurrentDisplay = () => {
    if (!value) return null;
    if (!value.startsWith("<")) return /* @__PURE__ */ jsx("span", { className: "text-base", children: value });
    const match = value.match(/<a?:(\w+):(\d+)>/);
    if (match) {
      const isAnimated = value.startsWith("<a:");
      return /* @__PURE__ */ jsx("img", { src: `https://cdn.discordapp.com/emojis/${match[2]}.${isAnimated ? "gif" : "png"}`, alt: match[1], className: "w-5 h-5" });
    }
    return /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground truncate", children: value });
  };
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setIsOpen(!isOpen),
          className: "flex items-center justify-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm hover:bg-secondary/70 transition-colors min-w-[80px]",
          children: value ? getCurrentDisplay() : /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSmile, className: "w-4 h-4 text-muted-foreground" })
        }
      ),
      value && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(""),
          className: "px-2 py-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground hover:text-red-400 hover:bg-secondary/70 transition-colors",
          children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-3 h-3" })
        }
      )
    ] }),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 mt-1 w-72 max-h-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2 border-b border-border", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search emojis...",
          className: "w-full px-3 py-1.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50",
          autoFocus: true
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto max-h-60 p-2", children: [
        standardEmojis.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 px-1", children: "Standard" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: standardEmojis.map((emoji) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSelect(emoji),
              className: "w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary/70 rounded-lg transition-colors",
              title: emoji.name,
              children: emoji.name
            },
            emoji.id
          )) })
        ] }),
        serverEmojis.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 px-1", children: "Server" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: serverEmojis.map((emoji) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleSelect(emoji),
              className: "w-8 h-8 flex items-center justify-center hover:bg-secondary/70 rounded-lg transition-colors",
              title: `:${emoji.name}:`,
              children: getEmojiDisplay(emoji)
            },
            emoji.id
          )) })
        ] }),
        filtered.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-muted-foreground py-4", children: "No emojis found" })
      ] })
    ] })
  ] });
};
const CommandEditor = ({
  command: initialCommand,
  roles,
  onSave,
  onClose,
  commandPrefix
}) => {
  const normalizedCommand = {
    ...initialCommand,
    text: initialCommand.text || "",
    embed: {
      title: initialCommand.embed?.title || "",
      description: Array.isArray(initialCommand.embed?.description) ? initialCommand.embed.description : [],
      color: initialCommand.embed?.color || "#5865F2",
      footer: { text: initialCommand.embed?.footer?.text || "", icon: initialCommand.embed?.footer?.icon || "" },
      author: { text: initialCommand.embed?.author?.text || "", icon: initialCommand.embed?.author?.icon || "" },
      thumbnail: initialCommand.embed?.thumbnail || "",
      image: initialCommand.embed?.image || "",
      fields: Array.isArray(initialCommand.embed?.fields) ? initialCommand.embed.fields : []
    },
    roles: { whitelist: Array.isArray(initialCommand.roles?.whitelist) ? initialCommand.roles.whitelist : [] },
    options: {
      deleteTriggerMessage: initialCommand.options?.deleteTriggerMessage || false,
      replyToUser: initialCommand.options?.replyToUser || false
    },
    buttons: Array.isArray(initialCommand.buttons) ? initialCommand.buttons : []
  };
  const [command, setCommand] = useState(normalizedCommand);
  const [activeSection, setActiveSection] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [emojis, setEmojis] = useState([]);
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const res = await fetch(`${config.API_URL}/settings/server-data`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setEmojis(data.emojis || []);
        }
      } catch (err) {
        console.error("Failed to fetch emojis:", err);
      }
    };
    fetchEmojis();
  }, []);
  const handleChange = (path, value) => {
    setCommand((prev) => {
      const newCommand = { ...prev };
      const keys = path.split(".");
      let current = newCommand;
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === void 0) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newCommand;
    });
  };
  const handleDescriptionChange = (value) => {
    handleChange("embed.description", value.split("\n"));
  };
  const addField = () => {
    setCommand((prev) => ({
      ...prev,
      embed: { ...prev.embed, fields: [...prev.embed?.fields || [], { name: "", value: "", inline: false }] }
    }));
  };
  const removeField = (index) => {
    setCommand((prev) => ({
      ...prev,
      embed: { ...prev.embed, fields: (prev.embed?.fields || []).filter((_, i) => i !== index) }
    }));
  };
  const updateField = (index, key, value) => {
    setCommand((prev) => ({
      ...prev,
      embed: {
        ...prev.embed,
        fields: (prev.embed?.fields || []).map((field, i) => i === index ? { ...field, [key]: value } : field)
      }
    }));
  };
  const defaultReply = {
    text: "",
    embed: {
      title: "",
      description: [],
      color: "#5865F2",
      footer: { text: "", icon: "" },
      author: { text: "", icon: "" },
      thumbnail: "",
      image: ""
    },
    ephemeral: false
  };
  const addButton = () => {
    setCommand((prev) => ({
      ...prev,
      buttons: [...prev.buttons || [], { type: "LINK", name: "", emoji: "", style: "Primary", link: "", reply: { ...defaultReply } }]
    }));
  };
  const removeButton = (index) => {
    setCommand((prev) => ({ ...prev, buttons: (prev.buttons || []).filter((_, i) => i !== index) }));
  };
  const updateButton = (index, key, value) => {
    setCommand((prev) => ({
      ...prev,
      buttons: (prev.buttons || []).map((btn, i) => {
        if (i !== index) return btn;
        if (key.startsWith("reply.")) {
          const replyKey = key.replace("reply.", "");
          const keys = replyKey.split(".");
          const newReply = { ...btn.reply || defaultReply };
          let current = newReply;
          for (let j = 0; j < keys.length - 1; j++) {
            current[keys[j]] = { ...current[keys[j]] };
            current = current[keys[j]];
          }
          current[keys[keys.length - 1]] = value;
          return { ...btn, reply: newReply };
        }
        return { ...btn, [key]: value };
      })
    }));
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(command);
    } finally {
      setIsSaving(false);
    }
  };
  const sections = [
    { id: "general", label: "General", icon: faCog },
    { id: "content", label: "Content", icon: faFileAlt },
    { id: "buttons", label: "Buttons", icon: faMousePointer },
    { id: "options", label: "Options", icon: faSlidersH }
  ];
  const inputClass = "w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm sm:text-base";
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 bg-background flex flex-col lg:left-64", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onClose,
            className: "flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors",
            children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faArrowLeft, className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium hidden sm:inline", children: "Back" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border hidden sm:block" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-base sm:text-lg font-semibold text-foreground", children: command._id ? "Edit Command" : "Create Command" }),
          command.name && /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground", children: [
            commandPrefix,
            command.name
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSave,
          disabled: isSaving || !command.name.trim(),
          className: "px-4 py-2 sm:px-5 sm:py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto",
          children: isSaving ? "Saving..." : "Save Command"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex lg:hidden overflow-x-auto gap-1 p-2 border-b border-border bg-card/30 scrollbar-hide", children: sections.map((section) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveSection(section.id),
        className: `flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${activeSection === section.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`,
        children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: section.icon, className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: section.label })
        ]
      },
      section.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex w-48 xl:w-56 border-r border-border bg-card/30 p-3 xl:p-4 flex-col gap-1.5 xl:gap-2 shrink-0", children: sections.map((section) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSection(section.id),
          className: `flex items-center gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-left transition-colors ${activeSection === section.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`,
          children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: section.icon, className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-sm xl:text-base", children: section.label })
          ]
        },
        section.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto lg:mx-0", children: [
        activeSection === "general" && /* @__PURE__ */ jsx("div", { className: "space-y-6 sm:space-y-8", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-semibold text-foreground mb-1", children: "General Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6", children: "Configure your command's basic settings" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Command Name" }),
              /* @__PURE__ */ jsxs("div", { className: "flex", children: [
                /* @__PURE__ */ jsx("span", { className: "px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary/70 border border-r-0 border-border rounded-l-xl text-muted-foreground text-sm", children: commandPrefix }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: command.name,
                    onChange: (e) => handleChange("name", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")),
                    placeholder: "command-name",
                    className: "flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary/50 border border-border rounded-r-xl text-foreground focus:outline-none focus:border-primary/50 text-sm sm:text-base"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Only lowercase letters, numbers, and hyphens allowed" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Response Type" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["EMBED", "TEXT", "BOTH"].map((type) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleChange("type", type),
                  className: `px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium transition-colors text-sm ${command.type === type ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
                  children: type
                },
                type
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Allowed Roles" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  multiple: true,
                  value: command.roles.whitelist,
                  onChange: (e) => handleChange("roles.whitelist", Array.from(e.target.selectedOptions, (o) => o.value)),
                  className: `${inputClass} min-h-[100px] sm:min-h-[120px]`,
                  children: roles.map((role) => /* @__PURE__ */ jsx("option", { value: role.id, children: role.name }, role.id))
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Leave empty to allow everyone. Hold Ctrl/Cmd to select multiple." })
            ] })
          ] })
        ] }) }),
        activeSection === "content" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-semibold text-foreground mb-1", children: "Content" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6", children: "Configure what your command will send" })
          ] }),
          (command.type === "TEXT" || command.type === "BOTH") && /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 bg-secondary/20 rounded-xl sm:rounded-2xl border border-border", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground mb-3 sm:mb-4", children: "Text Message" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: command.text,
                onChange: (e) => handleChange("text", e.target.value),
                placeholder: "Enter your message text here...",
                rows: 4,
                className: `${inputClass} resize-none`
              }
            )
          ] }),
          (command.type === "EMBED" || command.type === "BOTH") && /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 bg-secondary/20 rounded-xl sm:rounded-2xl border border-border space-y-4 sm:space-y-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Embed" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.title, onChange: (e) => handleChange("embed.title", e.target.value), placeholder: "Embed title", className: inputClass })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Color" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx("input", { type: "color", value: command.embed.color, onChange: (e) => handleChange("embed.color", e.target.value), className: "w-10 h-10 sm:w-12 sm:h-12 bg-secondary/50 border border-border rounded-xl cursor-pointer shrink-0" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.color, onChange: (e) => handleChange("embed.color", e.target.value), className: `flex-1 min-w-0 ${inputClass}` })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Description" }),
              /* @__PURE__ */ jsx("textarea", { value: command.embed.description.join("\n"), onChange: (e) => handleDescriptionChange(e.target.value), placeholder: "Enter embed description...", rows: 4, className: `${inputClass} resize-none` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Author" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.author.text, onChange: (e) => handleChange("embed.author.text", e.target.value), placeholder: "Author name", className: inputClass })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Author Icon URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.author.icon, onChange: (e) => handleChange("embed.author.icon", e.target.value), placeholder: "https://...", className: inputClass })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Footer" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.footer.text, onChange: (e) => handleChange("embed.footer.text", e.target.value), placeholder: "Footer text", className: inputClass })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Footer Icon URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.footer.icon, onChange: (e) => handleChange("embed.footer.icon", e.target.value), placeholder: "https://...", className: inputClass })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Thumbnail URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.thumbnail, onChange: (e) => handleChange("embed.thumbnail", e.target.value), placeholder: "https://...", className: inputClass })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Image URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: command.embed.image, onChange: (e) => handleChange("embed.image", e.target.value), placeholder: "https://...", className: inputClass })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Fields" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Add custom fields to your embed" })
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: addField, className: "px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-medium w-full sm:w-auto", children: [
                  /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3 mr-2" }),
                  "Add Field"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                command.embed.fields.map((field, i) => /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-4 bg-secondary/30 rounded-xl space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center", children: [
                    /* @__PURE__ */ jsx("input", { type: "text", value: field.name, onChange: (e) => updateField(i, "name", e.target.value), placeholder: "Field name", className: `flex-1 ${inputClass}` }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sm:justify-start gap-2", children: [
                      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap", children: [
                        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: field.inline, onChange: (e) => updateField(i, "inline", e.target.checked), className: "rounded" }),
                        "Inline"
                      ] }),
                      /* @__PURE__ */ jsx("button", { onClick: () => removeField(i), className: "p-2 sm:p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("textarea", { value: field.value, onChange: (e) => updateField(i, "value", e.target.value), placeholder: "Field value", rows: 2, className: `${inputClass} resize-none` })
                ] }, i)),
                command.embed.fields.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground text-sm py-6", children: "No fields added yet" })
              ] })
            ] })
          ] })
        ] }),
        activeSection === "buttons" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-semibold text-foreground mb-1", children: "Buttons" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Add interactive buttons to your response" })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: addButton, className: "px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium text-sm w-full sm:w-auto", children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3 mr-2" }),
              "Add Button"
            ] })
          ] }),
          command.buttons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 sm:py-16 text-muted-foreground bg-secondary/20 rounded-xl sm:rounded-2xl border border-border", children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faMousePointer, className: "w-6 h-6 sm:w-8 sm:h-8 mb-3 opacity-50" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No buttons added yet" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: 'Click "Add Button" to get started' })
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: command.buttons.map((button, i) => /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 bg-secondary/20 rounded-xl sm:rounded-2xl border border-border space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1 sm:gap-2", children: [
                /* @__PURE__ */ jsxs("button", { onClick: () => updateButton(i, "type", "LINK"), className: `flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm ${button.type === "LINK" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`, children: [
                  /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faExternalLinkAlt, className: "w-3 h-3" }),
                  "Link"
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => updateButton(i, "type", "REPLY"), className: `flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm ${button.type === "REPLY" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`, children: [
                  /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faReply, className: "w-3 h-3" }),
                  "Reply"
                ] })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => removeButton(i), className: "p-2 sm:p-2.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-end", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Label" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: button.name, onChange: (e) => updateButton(i, "name", e.target.value), placeholder: "Button label", className: inputClass })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Emoji" }),
                /* @__PURE__ */ jsx(EmojiPicker, { emojis, value: button.emoji, onChange: (emoji) => updateButton(i, "emoji", emoji) })
              ] }),
              button.type === "LINK" ? /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 lg:col-span-1", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: button.link || "", onChange: (e) => updateButton(i, "link", e.target.value), placeholder: "https://...", className: inputClass })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 lg:col-span-1", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Style" }),
                /* @__PURE__ */ jsxs("select", { value: button.style, onChange: (e) => updateButton(i, "style", e.target.value), className: inputClass, children: [
                  /* @__PURE__ */ jsx("option", { value: "Primary", children: "Primary (Blue)" }),
                  /* @__PURE__ */ jsx("option", { value: "Secondary", children: "Secondary (Gray)" }),
                  /* @__PURE__ */ jsx("option", { value: "Success", children: "Success (Green)" }),
                  /* @__PURE__ */ jsx("option", { value: "Danger", children: "Danger (Red)" })
                ] })
              ] })
            ] }),
            button.type === "REPLY" && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Reply Content" }),
                /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: button.reply?.ephemeral || false,
                      onChange: (e) => updateButton(i, "reply.ephemeral", e.target.checked),
                      className: "rounded"
                    }
                  ),
                  "Ephemeral (only visible to user)"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Text Message" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: button.reply?.text || "",
                    onChange: (e) => updateButton(i, "reply.text", e.target.value),
                    placeholder: "Reply text message...",
                    rows: 3,
                    className: `${inputClass} resize-none`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-4 bg-secondary/30 rounded-xl space-y-3 sm:space-y-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Embed (optional)" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Title" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: button.reply?.embed?.title || "",
                        onChange: (e) => updateButton(i, "reply.embed.title", e.target.value),
                        placeholder: "Embed title",
                        className: inputClass
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Color" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "color",
                          value: button.reply?.embed?.color || "#5865F2",
                          onChange: (e) => updateButton(i, "reply.embed.color", e.target.value),
                          className: "w-10 h-10 sm:w-12 sm:h-12 bg-secondary/50 border border-border rounded-xl cursor-pointer shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: button.reply?.embed?.color || "#5865F2",
                          onChange: (e) => updateButton(i, "reply.embed.color", e.target.value),
                          className: `flex-1 min-w-0 ${inputClass}`
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Description" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: (button.reply?.embed?.description || []).join("\n"),
                      onChange: (e) => updateButton(i, "reply.embed.description", e.target.value.split("\n")),
                      placeholder: "Embed description...",
                      rows: 3,
                      className: `${inputClass} resize-none`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Author" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: button.reply?.embed?.author?.text || "",
                        onChange: (e) => updateButton(i, "reply.embed.author.text", e.target.value),
                        placeholder: "Author name",
                        className: inputClass
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Footer" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: button.reply?.embed?.footer?.text || "",
                        onChange: (e) => updateButton(i, "reply.embed.footer.text", e.target.value),
                        placeholder: "Footer text",
                        className: inputClass
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Thumbnail URL" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: button.reply?.embed?.thumbnail || "",
                        onChange: (e) => updateButton(i, "reply.embed.thumbnail", e.target.value),
                        placeholder: "https://...",
                        className: inputClass
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm text-muted-foreground mb-2", children: "Image URL" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: button.reply?.embed?.image || "",
                        onChange: (e) => updateButton(i, "reply.embed.image", e.target.value),
                        placeholder: "https://...",
                        className: inputClass
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ] }, i)) })
        ] }),
        activeSection === "options" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-semibold text-foreground mb-1", children: "Options" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6", children: "Additional settings for your command" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-secondary/20 rounded-xl sm:rounded-2xl border border-border cursor-pointer hover:bg-secondary/30 transition-colors", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: command.options.replyToUser, onChange: (e) => handleChange("options.replyToUser", e.target.checked), className: "w-5 h-5 rounded mt-0.5 sm:mt-0 shrink-0" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground text-sm sm:text-base", children: "Reply to User" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Reply directly to the user's message instead of sending a new one" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-secondary/20 rounded-xl sm:rounded-2xl border border-border cursor-pointer hover:bg-secondary/30 transition-colors", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: command.options.deleteTriggerMessage, onChange: (e) => handleChange("options.deleteTriggerMessage", e.target.checked), className: "w-5 h-5 rounded mt-0.5 sm:mt-0 shrink-0" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground text-sm sm:text-base", children: "Delete Trigger Message" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Automatically delete the user's command message after responding" })
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden 2xl:flex w-80 xl:w-96 border-l border-border bg-card/30 p-4 xl:p-6 overflow-y-auto flex-col shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Live Preview" }),
        /* @__PURE__ */ jsx("div", { className: "bg-[#313338] rounded-xl p-3 xl:p-4", children: /* @__PURE__ */ jsx(CommandPreview, { command, commandPrefix }) })
      ] }) })
    ] })
  ] });
};
var stdin_default = CommandEditor;
export {
  stdin_default as default
};
