import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faCode, faCog, faArrowRight, faChartLine, faUsers } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import DashboardMetrics from "./DashboardMetrics";
import TicketChart from "./TicketChart";
import RecentTickets from "./RecentTickets";
import { formatResponseTime } from "../utils";
import { ticketService } from "../../../services/ticketService";
const periodMappings = {
  "1 Day": "1D",
  "1 Week": "1W",
  "1 Month": "1M",
  "3 Months": "3M",
  "1 Year": "1Y"
};
const periods = ["1 Day", "1 Week", "1 Month", "3 Months", "1 Year"];
const quickActions = [
  { name: "View Tickets", icon: faTicket, href: "/tickets", color: "from-emerald-500 to-green-600" },
  { name: "Embed Builder", icon: faCode, href: "/embed-builder", color: "from-violet-500 to-purple-600" },
  { name: "Settings", icon: faCog, href: "/settings", color: "from-sky-500 to-blue-600" }
];
function DashboardContentInner() {
  const [data, setData] = useState({
    totalTickets: 0,
    openTickets: 0,
    avgResponseTime: 0,
    satisfactionRate: 0,
    recentTickets: [],
    chartData: {
      "1D": [],
      "1W": [],
      "1M": [],
      "3M": [],
      "1Y": []
    },
    ticketTypeDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketChartPeriod, setTicketChartPeriod] = useState("1 Week");
  const [userChartPeriod, setUserChartPeriod] = useState("1 Week");
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2e3;
    async function fetchData() {
      if (!mounted) return;
      try {
        setLoading(true);
        setError(null);
        let result;
        while (retryCount < maxRetries) {
          try {
            result = await ticketService.getDashboardData();
            if (result) break;
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, retryDelay * retryCount));
            }
          } catch (err) {
            retryCount++;
            if (retryCount >= maxRetries) throw err;
            await new Promise((resolve) => setTimeout(resolve, retryDelay * retryCount));
          }
        }
        if (!mounted) return;
        if (!result) {
          throw new Error("No data received from server after retries");
        }
        const timeMetricsTotalTickets = result.timeMetrics ? (result.timeMetrics.older?.total || 0) + (result.timeMetrics.month?.total || 0) + (result.timeMetrics.week?.total || 0) : 0;
        const timeMetricsOpenTickets = result.timeMetrics ? (result.timeMetrics.older?.open || 0) + (result.timeMetrics.month?.open || 0) + (result.timeMetrics.week?.open || 0) : 0;
        const totalTickets = result.totalTickets || timeMetricsTotalTickets;
        const openTickets = result.openTickets || timeMetricsOpenTickets;
        const avgResponseTime = Number(result.avgResponseTime) || 0;
        const satisfactionRate = result.satisfactionRate ?? 1;
        const weeklyChanges = result.weeklyChanges ? {
          totalTickets: parseInt(String(result.weeklyChanges.totalTickets)) || 0,
          openTickets: parseInt(String(result.weeklyChanges.openTickets)) || 0,
          avgResponseTime: Number(result.weeklyChanges.avgResponseTime) || 0,
          satisfactionRate: typeof result.weeklyChanges?.satisfactionRate === "number" ? result.weeklyChanges.satisfactionRate : 0
        } : void 0;
        if (isNaN(totalTickets) || isNaN(openTickets)) {
          console.error("Invalid numeric values:", { totalTickets, openTickets });
          throw new Error("Invalid numeric data received");
        }
        const chartData = {
          "1D": [],
          "1W": [],
          "1M": [],
          "3M": [],
          "1Y": []
        };
        if (result.chartData) {
          Object.keys(chartData).forEach((key) => {
            chartData[key] = Array.isArray(result.chartData[key]) ? result.chartData[key] : [];
          });
        }
        setData((prevData) => {
          return {
            ...prevData,
            totalTickets,
            openTickets,
            avgResponseTime,
            satisfactionRate,
            weeklyChanges,
            recentTickets: Array.isArray(result.recentTickets) ? result.recentTickets : prevData.recentTickets,
            chartData,
            ticketTypeDistribution: Array.isArray(result.ticketTypeDistribution) ? result.ticketTypeDistribution : prevData.ticketTypeDistribution
          };
        });
        retryCount = 0;
      } catch (error2) {
        console.error("Failed to fetch ticket data:", error2);
        if (mounted && retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchData, retryDelay);
        } else if (mounted) {
          setError("Failed to fetch data. Please try refreshing the page.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);
  const metrics = useMemo(() => [
    {
      title: "Total Tickets",
      value: String(data?.totalTickets ?? 0),
      change: data.weeklyChanges?.totalTickets,
      color: "pink",
      tooltip: "Total number of tickets created"
    },
    {
      title: "Open Tickets",
      value: String(data?.openTickets ?? 0),
      change: data.weeklyChanges?.openTickets,
      color: "purple",
      tooltip: "Currently open tickets"
    },
    {
      title: "Avg. Response Time",
      value: formatResponseTime(data?.avgResponseTime ?? 0),
      change: data.weeklyChanges?.avgResponseTime,
      color: "blue",
      tooltip: "Average time to first staff response"
    },
    {
      title: "Customer Satisfaction",
      value: typeof data?.satisfactionRate === "number" ? `${data.satisfactionRate.toFixed(1)}%` : "N/A",
      change: data.weeklyChanges?.satisfactionRate,
      color: "green",
      tooltip: "Based on ticket ratings"
    }
  ], [data?.totalTickets, data?.openTickets, data?.avgResponseTime, data?.satisfactionRate, data?.weeklyChanges]);
  const ticketChartData = useMemo(() => {
    const period = periodMappings[ticketChartPeriod];
    const rawData = data.chartData[period] || [];
    if (period === "1D") {
      const labels2 = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
      return {
        labels: labels2,
        datasets: [{
          label: "Total Tickets",
          data: labels2.map((hour) => {
            const entry = rawData.find((d) => d.hour === parseInt(hour));
            return entry?.count || 0;
          }),
          borderColor: "rgb(129, 140, 248)",
          backgroundColor: "rgba(129, 140, 248, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2
        }]
      };
    }
    const labels = rawData.length > 0 ? rawData.map((d) => {
      if (period === "1W") return d.day || "";
      if (period === "1M") return d.date || "";
      return d.month || "";
    }) : [];
    return {
      labels,
      datasets: [{
        label: "Total Tickets",
        data: rawData.map((d) => d.count || 0),
        borderColor: "rgb(129, 140, 248)",
        backgroundColor: "rgba(129, 140, 248, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      }]
    };
  }, [data.chartData, ticketChartPeriod]);
  const userChartData = useMemo(() => {
    const period = periodMappings[userChartPeriod];
    const rawData = data.chartData[period] || [];
    if (period === "1D") {
      const labels2 = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
      return {
        labels: labels2,
        datasets: [{
          label: "Discord Members",
          data: labels2.map((hour) => {
            const entry = rawData.find((d) => d.hour === parseInt(hour));
            return entry?.users || 0;
          }),
          borderColor: "rgb(234, 179, 8)",
          backgroundColor: "rgba(234, 179, 8, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2
        }]
      };
    }
    const labels = rawData.length > 0 ? rawData.map((d) => {
      if (period === "1W") return d.day || "";
      if (period === "1M") return d.date || "";
      return d.month || "";
    }) : [];
    return {
      labels,
      datasets: [{
        label: "Discord Members",
        data: rawData.map((d) => d.users || 0),
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      }]
    };
  }, [data.chartData, userChartPeriod]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsx(LoadingSpinner, {}) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[200px] glass-card border-destructive/20 text-destructive text-sm mx-4 p-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "Something went wrong" }),
      /* @__PURE__ */ jsx("p", { className: "text-destructive/70", children: error })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 p-4 lg:p-6 max-w-[1600px] mx-auto w-full", children: [
    /* @__PURE__ */ jsx(DashboardMetrics, { metrics }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.15 },
        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
        children: quickActions.map((action, index) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: action.href,
            className: "group glass-card-hover p-5 flex items-center gap-4",
            children: [
              /* @__PURE__ */ jsx("div", { className: `p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg transition-transform duration-300 group-hover:scale-110`, children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: action.icon, className: "w-5 h-5 text-white" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: action.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Quick access" })
              ] }),
              /* @__PURE__ */ jsx(
                FontAwesomeIcon,
                {
                  icon: faArrowRight,
                  className: "w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                }
              )
            ]
          },
          action.name
        ))
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "glass-card overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/30", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-indigo-500/10", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faChartLine, className: "w-4 h-4 text-indigo-400" }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Ticket Activity" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-1 p-1 glass-subtle rounded-lg", children: periods.map((p) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setTicketChartPeriod(p),
                  className: `px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 ${ticketChartPeriod === p ? "bg-primary text-primary-foreground shadow-glow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`,
                  children: p
                },
                p
              )) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-5 h-[300px]", children: /* @__PURE__ */ jsx(
              TicketChart,
              {
                data: ticketChartData.datasets,
                labels: ticketChartData.labels,
                period: ticketChartPeriod,
                hideControls: true
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.25 },
          className: "glass-card overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/30", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 rounded-xl bg-amber-500/10", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faUsers, className: "w-4 h-4 text-amber-400" }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "User Activity" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-1 p-1 glass-subtle rounded-lg", children: periods.map((p) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setUserChartPeriod(p),
                  className: `px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 ${userChartPeriod === p ? "bg-primary text-primary-foreground shadow-glow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`,
                  children: p
                },
                p
              )) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-5 h-[300px]", children: /* @__PURE__ */ jsx(
              TicketChart,
              {
                data: userChartData.datasets,
                labels: userChartData.labels,
                period: userChartPeriod,
                hideControls: true,
                chartColor: "yellow"
              }
            ) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(RecentTickets, { tickets: data.recentTickets })
  ] });
}
var stdin_default = React.memo(DashboardContentInner);
export {
  stdin_default as default
};
