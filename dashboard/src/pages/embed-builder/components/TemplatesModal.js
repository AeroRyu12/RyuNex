import { jsx, jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
const TemplatesModal = ({
  isOpen,
  onClose,
  templates,
  onLoadTemplate,
  onDeleteTemplate
}) => {
  if (!isOpen) return null;
  const handleLoadTemplate = (templateId) => {
    onLoadTemplate(templateId);
    onClose();
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Template Library" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Load or manage your saved embed templates" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors",
            children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes, className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto max-h-[60vh]", children: templates.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: templates.map((template) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group bg-secondary/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-foreground mb-2", children: template.name }),
              /* @__PURE__ */ jsx("div", { className: "bg-[#313338] rounded-lg p-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
                /* @__PURE__ */ jsx("div", { className: "w-1 bg-blue-500 rounded-l" }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[#2B2D31] rounded-r flex-1 p-2", children: [
                  template.embedData.title && /* @__PURE__ */ jsx("div", { className: "text-[#00a8fc] font-semibold text-sm mb-1 truncate", children: template.embedData.title }),
                  template.embedData.description && /* @__PURE__ */ jsx("div", { className: "text-[#dbdee1] text-xs line-clamp-2", children: template.embedData.description }),
                  template.embedData.fields && template.embedData.fields.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-[#989AA2] text-xs mt-1", children: [
                    template.embedData.fields.length,
                    " field",
                    template.embedData.fields.length !== 1 ? "s" : ""
                  ] })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleLoadTemplate(template._id),
                  className: "flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium",
                  children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFolderOpen, className: "w-4 h-4" }),
                    /* @__PURE__ */ jsx("span", { children: "Load" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => onDeleteTemplate(template._id),
                  className: "p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
                  title: "Delete Template",
                  children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
                }
              )
            ] })
          ]
        },
        template._id
      )) }) : /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground mb-4", children: [
        /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faFolderOpen, className: "w-12 h-12 mx-auto mb-4 opacity-50" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "No Templates Yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Create your first embed and save it as a template to get started" })
      ] }) }) })
    ] })
  ] });
};
var stdin_default = TemplatesModal;
export {
  stdin_default as default
};
