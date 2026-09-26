import { jsx, jsxs } from "react/jsx-runtime";
const buttonStyles = {
  Primary: "bg-[#5865F2] hover:bg-[#4752C4]",
  Secondary: "bg-[#4E505D] hover:bg-[#6D6F7B]",
  Success: "bg-[#248046] hover:bg-[#1A6334]",
  Danger: "bg-[#DA373C] hover:bg-[#A12D31]",
  Link: "bg-[#4E505D] hover:bg-[#6D6F7B]"
};
const CommandPreview = ({ command, commandPrefix }) => {
  const description = Array.isArray(command.embed?.description) ? command.embed.description : [];
  const fields = Array.isArray(command.embed?.fields) ? command.embed.fields : [];
  const buttons = Array.isArray(command.buttons) ? command.buttons : [];
  const hasContent = command.text || command.embed?.title || description.length > 0;
  if (!hasContent && buttons.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground text-sm", children: "Start adding content to see a preview" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#313338] rounded-lg p-4", children: [
    !command.options.deleteTriggerMessage && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4 pb-4 border-b border-[#3f4147]", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-medium shrink-0", children: "U" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-white font-medium text-sm", children: "User" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#989AA2] text-xs", children: [
            "Today at ",
            (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[#dbdee1] text-sm mt-0.5", children: [
          commandPrefix,
          command.name || "command"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-medium shrink-0", children: "B" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-white font-medium text-sm", children: "Bot" }),
          /* @__PURE__ */ jsx("span", { className: "bg-[#5865F2] text-white text-[10px] px-1 py-0.5 rounded font-medium", children: "BOT" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#989AA2] text-xs", children: [
            "Today at ",
            (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          ] })
        ] }),
        command.options.replyToUser && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-[#989AA2] mb-1", children: [
          /* @__PURE__ */ jsx("svg", { className: "w-3 h-3", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10 8.26667L7.33333 11.1333V8.66667H4.66667V5H10V8.26667ZM11.3333 4V9.66667H8.33333V12.8L5.66667 9.66667H3.33333V4H11.3333ZM22 13.3333L22 20H14.6667V17.3333L17.3333 17.3333V19L21 19V14.3333L14.6667 14.3333V13.3333L22 13.3333Z" }) }),
          /* @__PURE__ */ jsx("span", { children: "replying to" }),
          /* @__PURE__ */ jsx("span", { className: "text-[#00a8fc]", children: "@User" })
        ] }),
        (command.type === "TEXT" || command.type === "BOTH") && command.text && /* @__PURE__ */ jsx("p", { className: "text-[#dbdee1] text-sm mb-2 whitespace-pre-wrap", children: command.text }),
        (command.type === "EMBED" || command.type === "BOTH") && (command.embed?.title || description.length > 0) && /* @__PURE__ */ jsxs("div", { className: "flex mt-1", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-1 rounded-l shrink-0",
              style: { backgroundColor: command.embed?.color || "#5865F2" }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex-1 bg-[#2B2D31] rounded-r p-3 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 pr-3", children: [
              command.embed?.author?.text && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                command.embed?.author?.icon && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: command.embed.author.icon,
                    alt: "",
                    className: "w-5 h-5 rounded-full",
                    onError: (e) => e.target.style.display = "none"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-medium", children: command.embed.author.text })
              ] }),
              command.embed?.title && /* @__PURE__ */ jsx("h4", { className: "text-[#00a8fc] font-semibold text-sm mb-1", children: command.embed.title }),
              description.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-[#dbdee1] text-sm whitespace-pre-wrap", children: description.join("\n") }),
              fields.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2 mt-2", children: fields.map((field, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: field.inline ? "inline-block mr-4" : "block",
                  children: [
                    field.name && /* @__PURE__ */ jsx("h5", { className: "text-white font-semibold text-xs mb-0.5", children: field.name }),
                    field.value && /* @__PURE__ */ jsx("p", { className: "text-[#dbdee1] text-xs", children: field.value })
                  ]
                },
                index
              )) }),
              command.embed?.image && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: command.embed.image,
                  alt: "",
                  className: "max-w-full rounded max-h-[200px] object-contain",
                  onError: (e) => e.target.style.display = "none"
                }
              ) }),
              command.embed?.footer?.text && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2 pt-2", children: [
                command.embed?.footer?.icon && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: command.embed.footer.icon,
                    alt: "",
                    className: "w-4 h-4 rounded-full",
                    onError: (e) => e.target.style.display = "none"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[#989AA2] text-xs", children: command.embed.footer.text })
              ] })
            ] }),
            command.embed?.thumbnail && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: command.embed.thumbnail,
                alt: "",
                className: "w-16 h-16 rounded object-cover",
                onError: (e) => e.target.style.display = "none"
              }
            ) })
          ] }) })
        ] }),
        buttons.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: buttons.map((button, index) => /* @__PURE__ */ jsxs(
          "button",
          {
            className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-white text-sm font-medium transition-colors ${button.type === "LINK" ? buttonStyles.Link : buttonStyles[button.style]}`,
            children: [
              button.emoji && /* @__PURE__ */ jsx("span", { children: button.emoji }),
              /* @__PURE__ */ jsx("span", { children: button.name || "Button" }),
              button.type === "LINK" && /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 ml-1", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.2071 14.2071L9.79289 12.7929L17.585 5H13V3H21Z" }) })
            ]
          },
          index
        )) })
      ] })
    ] })
  ] });
};
var stdin_default = CommandPreview;
export {
  stdin_default as default
};
