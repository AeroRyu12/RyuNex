import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faToggleOn, faToggleOff, faTerminal } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "../../../components/ui/Toast";
import CommandEditor from "./CommandEditor";
const defaultEmbed = {
  title: "",
  description: [],
  color: "#5865F2",
  footer: { text: "", icon: "" },
  author: { text: "", icon: "" },
  thumbnail: "",
  image: "",
  fields: []
};
const defaultCommand = {
  name: "",
  type: "EMBED",
  text: "",
  embed: defaultEmbed,
  roles: { whitelist: [] },
  options: { deleteTriggerMessage: false, replyToUser: false },
  buttons: [],
  enabled: true
};
const CustomCommandBuilder = () => {
  const [commands, setCommands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const commandPrefix = "!";
  useEffect(() => {
    fetchCommands();
    fetchServerData();
  }, []);
  const fetchCommands = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/custom-commands");
      setCommands(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch commands:", error);
      toast.error("Failed to load custom commands");
      setCommands([]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchServerData = async () => {
    try {
      const response = await axios.get("/api/settings/server-data");
      setRoles(response.data.roles || []);
    } catch (error) {
      console.error("Failed to fetch server data:", error);
    }
  };
  const handleCreateCommand = () => {
    setEditingCommand({ ...defaultCommand });
    setIsEditorOpen(true);
  };
  const handleEditCommand = (command) => {
    setEditingCommand({ ...command });
    setIsEditorOpen(true);
  };
  const handleSaveCommand = async (command) => {
    try {
      if (command._id) {
        await axios.put(`/api/custom-commands/${command._id}`, command);
        toast.success("Command updated successfully");
      } else {
        await axios.post("/api/custom-commands", command);
        toast.success("Command created successfully");
      }
      setIsEditorOpen(false);
      setEditingCommand(null);
      fetchCommands();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save command");
    }
  };
  const handleDeleteCommand = async (id) => {
    if (!confirm("Are you sure you want to delete this command?")) return;
    try {
      await axios.delete(`/api/custom-commands/${id}`);
      toast.success("Command deleted successfully");
      fetchCommands();
    } catch (error) {
      toast.error("Failed to delete command");
    }
  };
  const handleToggleCommand = async (id) => {
    try {
      await axios.patch(`/api/custom-commands/${id}/toggle`);
      fetchCommands();
    } catch (error) {
      toast.error("Failed to toggle command");
    }
  };
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingCommand(null);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-4 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-foreground", children: "Custom Commands" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create and manage custom prefix commands for your server" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleCreateCommand,
          className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium",
          children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-4 h-4" }),
            "New Command"
          ]
        }
      )
    ] }),
    commands.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTerminal, className: "w-7 h-7 text-muted-foreground" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No Custom Commands" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Create your first custom command to get started" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleCreateCommand,
          className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium",
          children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-4 h-4" }),
            "Create Command"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: commands.map((command) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `bg-card rounded-xl border border-border p-4 transition-all ${!command.enabled ? "opacity-60" : ""}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${command.enabled ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`, children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTerminal, className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("code", { className: "text-sm font-mono font-medium text-foreground bg-secondary px-2 py-0.5 rounded", children: [
                  commandPrefix,
                  command.name
                ] }),
                /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[11px] font-medium ${command.type === "EMBED" ? "bg-blue-500/10 text-blue-400" : command.type === "TEXT" ? "bg-green-500/10 text-green-400" : "bg-purple-500/10 text-purple-400"}`, children: command.type }),
                (command.buttons?.length || 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400", children: [
                  command.buttons.length,
                  " button",
                  command.buttons.length > 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 truncate max-w-md", children: command.embed?.title || command.text || "No content" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleToggleCommand(command._id),
                className: `p-2 rounded-lg transition-colors ${command.enabled ? "text-green-400 hover:bg-green-500/10" : "text-muted-foreground hover:bg-secondary"}`,
                title: command.enabled ? "Disable command" : "Enable command",
                children: /* @__PURE__ */ jsx(
                  FontAwesomeIcon,
                  {
                    icon: command.enabled ? faToggleOn : faToggleOff,
                    className: "w-5 h-5"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleEditCommand(command),
                className: "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                title: "Edit command",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPen, className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDeleteCommand(command._id),
                className: "p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors",
                title: "Delete command",
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      },
      command._id
    )) }),
    isEditorOpen && editingCommand && /* @__PURE__ */ jsx(
      CommandEditor,
      {
        command: editingCommand,
        roles,
        onSave: handleSaveCommand,
        onClose: handleCloseEditor,
        commandPrefix
      }
    )
  ] });
};
var stdin_default = CustomCommandBuilder;
export {
  stdin_default as default
};
