import { jsx, jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faCircle, faClock, faSmile, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
function formatResponseTime(minutes) {
  if (minutes === 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
}
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
function TicketStats({
  tickets,
  totalTickets,
  openTickets,
  avgResponseTime,
  satisfactionRate,
  weeklyChanges
}) {
  const stats = [
    {
      title: "Total Tickets",
      value: String(totalTickets),
      change: weeklyChanges?.totalTickets,
      icon: faTicket,
      gradient: "from-rose-500 to-pink-600",
      glow: "shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)]"
    },
    {
      title: "Open Tickets",
      value: String(openTickets),
      change: weeklyChanges?.openTickets,
      icon: faCircle,
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]"
    },
    {
      title: "Avg. Response Time",
      value: formatResponseTime(avgResponseTime),
      change: weeklyChanges?.avgResponseTime,
      icon: faClock,
      gradient: "from-sky-500 to-blue-600",
      glow: "shadow-[0_0_20px_-5px_rgba(14,165,233,0.5)]"
    },
    {
      title: "Customer Satisfaction",
      value: `${satisfactionRate}%`,
      change: weeklyChanges?.satisfactionRate,
      icon: faSmile,
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]"
    }
  ];
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      variants: container,
      initial: "hidden",
      animate: "show",
      className: "grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6",
      children: stats.map((stat) => {
        const hasChange = stat.change !== void 0 && stat.change !== 0;
        const isPositive = (stat.change ?? 0) > 0;
        return /* @__PURE__ */ jsxs(
          motion.div,
          {
            variants: item,
            className: "group glass-card-hover p-5",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: `relative p-3 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.glow} transition-transform duration-300 group-hover:scale-110`, children: [
                  /* @__PURE__ */ jsx(
                    FontAwesomeIcon,
                    {
                      icon: stat.icon,
                      className: "w-5 h-5 text-white"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" })
                ] }),
                hasChange && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`, children: [
                  /* @__PURE__ */ jsx(
                    FontAwesomeIcon,
                    {
                      icon: isPositive ? faArrowUp : faArrowDown,
                      className: "w-2.5 h-2.5"
                    }
                  ),
                  Math.abs(stat.change ?? 0),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-foreground tracking-tight font-mono", children: stat.value }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: stat.title })
              ] })
            ]
          },
          stat.title
        );
      })
    }
  );
}
export {
  TicketStats as default
};
