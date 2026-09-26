import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHome,
  faTicket,
  faCode,
  faCog,
  faComments,
  faTerminal,
  faArrowRight,
  faKeyboard
} from "@fortawesome/free-solid-svg-icons";
const commands = [
  { id: "home", name: "Overview", description: "Go to dashboard overview", icon: faHome, href: "/", keywords: ["home", "dashboard", "overview", "main"] },
  { id: "tickets", name: "Support Tickets", description: "View and manage tickets", icon: faTicket, href: "/tickets", keywords: ["tickets", "support", "help"] },
  { id: "embed", name: "Embed Builder", description: "Create Discord embeds", icon: faCode, href: "/embed-builder", keywords: ["embed", "builder", "discord", "message"] },
  { id: "commands", name: "Custom Commands", description: "Manage bot commands", icon: faTerminal, href: "/custom-commands", keywords: ["commands", "custom", "bot"] },
  { id: "suggestions", name: "Suggestions", description: "View user suggestions", icon: faComments, href: "/suggestions", keywords: ["suggestions", "feedback", "ideas"] },
  { id: "settings", name: "Settings", description: "Configure dashboard settings", icon: faCog, href: "/settings", keywords: ["settings", "config", "preferences"] },
  { id: "user-settings", name: "User Settings", description: "Your personal settings", icon: faCog, href: "/user-settings", keywords: ["user", "profile", "account"] }
];
function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const filteredCommands = query === "" ? commands : commands.filter((command) => {
    const searchTerms = [command.name, command.description, ...command.keywords];
    return searchTerms.some(
      (term) => term.toLowerCase().includes(query.toLowerCase())
    );
  });
  const handleSelect = useCallback((command) => {
    navigate(command.href);
    onClose();
    setQuery("");
    setSelectedIndex(0);
  }, [navigate, onClose]);
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(
            (prev) => prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleSelect(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, handleSelect, onClose]);
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
        className: "fixed inset-0 bg-background/60 backdrop-blur-sm z-50",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: -20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -20 },
        transition: { duration: 0.15 },
        className: "w-full max-w-lg glass-card overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 border-b border-border/30", children: [
            /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faSearch, className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: inputRef,
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Search for pages...",
                className: "flex-1 h-14 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono", children: /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30", children: "esc" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-[300px] overflow-y-auto p-2", children: filteredCommands.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No results found" }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-1", children: filteredCommands.map((command, index) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleSelect(command),
              className: `w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${index === selectedIndex ? "bg-primary/10 text-foreground" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg transition-colors ${index === selectedIndex ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground"}`, children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: command.icon, className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: command.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: command.description })
                ] }),
                index === selectedIndex && /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faArrowRight, className: "w-3 h-3 text-primary" })
              ]
            },
            command.id
          )) }) }),
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground/50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono", children: "\u2191" }),
                /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono", children: "\u2193" }),
                "to navigate"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("kbd", { className: "px-1.5 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono", children: "\u21B5" }),
                "to select"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faKeyboard, className: "w-3 h-3" }),
              "Quick navigation"
            ] })
          ] })
        ]
      }
    ) })
  ] }) });
}
function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev)
  };
}
var stdin_default = CommandPalette;
export {
  CommandPalette,
  stdin_default as default,
  useCommandPalette
};
