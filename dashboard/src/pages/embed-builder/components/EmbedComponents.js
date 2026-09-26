import { jsx, jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
const TitleComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Title" }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      value: embed.title,
      onChange: (e) => handleChange("title", e.target.value),
      className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
      placeholder: "Enter title"
    }
  )
] });
const DescriptionComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Description" }),
  /* @__PURE__ */ jsx(
    "textarea",
    {
      value: embed.description,
      onChange: (e) => handleChange("description", e.target.value),
      className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 h-48 resize-y whitespace-pre-wrap",
      placeholder: "Enter description",
      style: { minHeight: "8rem" }
    }
  )
] });
const ColorComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Color" }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "color",
      value: embed.color,
      onChange: (e) => handleChange("color", e.target.value),
      className: "w-full h-10 bg-background border border-border rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
    }
  )
] });
const AuthorComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Author" }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: embed.author.name,
        onChange: (e) => handleChange("author.name", e.target.value),
        className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
        placeholder: "Author name"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: embed.author.icon_url,
        onChange: (e) => handleChange("author.icon_url", e.target.value),
        className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
        placeholder: "Author icon URL"
      }
    )
  ] })
] });
const FieldsComponent = ({
  embed,
  addField,
  removeField,
  handleFieldChange,
  onRemove
}) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground", children: "Fields" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: addField,
        className: "flex items-center space-x-2 px-3 py-1 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors",
        children: /* @__PURE__ */ jsx("span", { children: "Add Field" })
      }
    )
  ] }),
  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: embed.fields.map((field, index) => /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-lg p-4 space-y-3 group/field", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("h4", { className: "text-sm font-medium text-foreground", children: [
        "Field ",
        index + 1
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => removeField(index),
          className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded opacity-0 group-hover/field:opacity-100",
          children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: field.name,
        onChange: (e) => handleFieldChange(index, "name", e.target.value),
        className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
        placeholder: "Field name"
      }
    ),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        value: field.value,
        onChange: (e) => handleFieldChange(index, "value", e.target.value),
        className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 h-20 resize-none",
        placeholder: "Field value"
      }
    ),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: field.inline,
          onChange: (e) => handleFieldChange(index, "inline", e.target.checked),
          className: "rounded bg-background border-border text-primary focus:ring-primary"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: "Inline" })
    ] })
  ] }, index)) })
] });
const FooterComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Footer" }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: embed.footer.text,
        onChange: (e) => handleChange("footer.text", e.target.value),
        className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
        placeholder: "Footer text"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: embed.footer.icon_url,
        onChange: (e) => handleChange("footer.icon_url", e.target.value),
        className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
        placeholder: "Footer icon URL"
      }
    )
  ] })
] });
const ImageComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Image" }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      value: embed.image,
      onChange: (e) => handleChange("image", e.target.value),
      className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
      placeholder: "Image URL"
    }
  )
] });
const ThumbnailComponent = ({ embed, handleChange, onRemove }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Thumbnail" }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      value: embed.thumbnail,
      onChange: (e) => handleChange("thumbnail", e.target.value),
      className: "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
      placeholder: "Thumbnail URL"
    }
  )
] });
const LinkButtonsComponent = ({
  embed,
  onRemove,
  addLinkButton,
  removeLinkButton,
  handleLinkButtonChange
}) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-4 border border-border relative group hover:border-primary/50 transition-all duration-200", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onRemove,
      className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
      children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-4 h-4" })
    }
  ) }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground", children: "Link Buttons" }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: addLinkButton,
        className: "flex items-center space-x-2 px-3 py-1 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm",
        children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPlus, className: "w-3 h-3" }),
          /* @__PURE__ */ jsx("span", { children: "Add Button" })
        ]
      }
    )
  ] }),
  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: embed.linkButtons.map((button, index) => /* @__PURE__ */ jsxs("div", { className: "relative group/button bg-background rounded-lg p-4 border border-border", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover/button:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => removeLinkButton(index),
        className: "text-destructive hover:text-destructive/80 transition-colors p-1 hover:bg-destructive/10 rounded",
        children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTrash, className: "w-3 h-3" })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: button.label,
          onChange: (e) => handleLinkButtonChange(index, "label", e.target.value),
          className: "w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
          placeholder: "Button Label"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: button.url,
          onChange: (e) => handleLinkButtonChange(index, "url", e.target.value),
          className: "w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
          placeholder: "Button URL"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: button.emoji || "",
          onChange: (e) => handleLinkButtonChange(index, "emoji", e.target.value),
          className: "w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
          placeholder: "Button Emoji (optional)"
        }
      )
    ] })
  ] }, index)) })
] });
export {
  AuthorComponent,
  ColorComponent,
  DescriptionComponent,
  FieldsComponent,
  FooterComponent,
  ImageComponent,
  LinkButtonsComponent,
  ThumbnailComponent,
  TitleComponent
};
