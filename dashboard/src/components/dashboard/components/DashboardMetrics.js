import { jsx, jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faCircle, faClock, faSmile, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
const iconConfig = {
  "Total Tickets": {
    icon: faTicket,
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)]",
    bg: "bg-rose-500/10",
    text: "text-rose-400"
  },
  "Open Tickets": {
    icon: faCircle,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]",
    bg: "bg-violet-500/10",
    text: "text-violet-400"
  },
  "Avg. Response Time": {
    icon: faClock,
    gradient: "from-sky-500 to-blue-600",
    glow: "shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)]",
    bg: "bg-sky-500/10",
    text: "text-sky-400"
  },
  "Customer Satisfaction": {
    icon: faSmile,
    gradient: "from-emerald-500 to-green-600",
    glow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400"
  }
};
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
function DashboardMetrics({ metrics }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      variants: container,
      initial: "hidden",
      animate: "show",
      className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
      children: metrics.map((metric) => {
        const config = iconConfig[metric.title];
        const hasChange = metric.change !== void 0 && metric.change !== 0;
        const isPositive = (metric.change ?? 0) > 0;
        return /* @__PURE__ */ jsxs(
          motion.div,
          {
            variants: item,
            className: "group glass-card-hover p-5",
            title: metric.tooltip,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: `relative p-3 rounded-xl bg-gradient-to-br ${config.gradient} ${config.glow} transition-all duration-300 group-hover:scale-110`, children: [
                  /* @__PURE__ */ jsx(
                    FontAwesomeIcon,
                    {
                      icon: config.icon,
                      className: "w-5 h-5 text-white"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" })
                ] }),
                hasChange && /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { scale: 0.8, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        FontAwesomeIcon,
                        {
                          icon: isPositive ? faArrowUp : faArrowDown,
                          className: "w-2.5 h-2.5"
                        }
                      ),
                      Math.abs(metric.change ?? 0),
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-foreground tracking-tight font-mono", children: metric.value }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: metric.title })
              ] })
            ]
          },
          metric.title
        );
      })
    }
  );
}
export {
  DashboardMetrics as default
};
