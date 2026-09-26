import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faGripVertical } from "@fortawesome/free-solid-svg-icons";
const defaultSortFields = [
  { status: "open", order: 1 },
  { status: "closed", order: 2 },
  { status: "deleted", order: 3 }
];
const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "bg-green-500/10 text-green-400 ring-1 ring-green-500/30";
    case "closed":
      return "bg-red-500/10 text-red-400 ring-1 ring-red-500/30";
    case "deleted":
      return "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30";
    default:
      return "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/30";
  }
};
function TicketSortModal({ isOpen, onClose, onSave, initialSortOrder }) {
  const [sortOrder, setSortOrder] = useState(defaultSortFields);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  useEffect(() => {
    if (isOpen) {
      setSortOrder(initialSortOrder || defaultSortFields);
    }
  }, [isOpen, initialSortOrder]);
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.currentTarget.classList.add("opacity-50");
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    const items = Array.from(sortOrder);
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    setSortOrder(updatedItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleSave = () => {
    onSave(sortOrder);
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-gray-900/95 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/50 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white", children: "Sort Tickets by Status" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-400 hover:text-white transition-colors duration-200",
          children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTimes })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Drag and drop to reorder how ticket statuses are displayed." }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: sortOrder.map((field, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        draggable: true,
        onDragStart: (e) => handleDragStart(e, index),
        onDragEnd: handleDragEnd,
        onDragOver: (e) => handleDragOver(e, index),
        onDrop: (e) => handleDrop(e, index),
        className: `flex items-center bg-gray-800/50 rounded-lg p-4 group border backdrop-blur-sm transition-all duration-200 ${draggedIndex === index ? "opacity-50 border-blue-500/50" : dragOverIndex === index ? "border-blue-500/50 scale-[1.02]" : "border-gray-700/50 hover:border-gray-600/50"}`,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mr-3 text-gray-500 hover:text-gray-400 transition-colors cursor-grab active:cursor-grabbing",
              children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faGripVertical })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-grow flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: `px-3 py-1.5 rounded-full text-sm font-medium capitalize ${getStatusColor(field.status)}`, children: field.status }),
            /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm", children: [
              "Order: ",
              field.order
            ] })
          ] })
        ]
      },
      field.status
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-800/50", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSave,
          className: "px-4 py-2 text-sm font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 ring-1 ring-blue-500/30 hover:ring-blue-500/50",
          children: "Save Sort Order"
        }
      )
    ] })
  ] }) }) });
}
export {
  TicketSortModal as default
};
