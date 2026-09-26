import { jsx } from "react/jsx-runtime";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
function TicketChart({ data, labels, period, hideControls = false, chartColor = "indigo" }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgb(17, 24, 39)",
        titleColor: "rgb(243, 244, 246)",
        bodyColor: "rgb(209, 213, 219)",
        borderColor: "rgb(75, 85, 99)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 13,
          weight: 600
        },
        bodyFont: {
          size: 12,
          weight: 500
        },
        callbacks: {
          title: (items) => {
            const item = items[0];
            const date = /* @__PURE__ */ new Date();
            switch (period) {
              case "1 Day":
                return `${item.label}:00`;
              case "1 Week": {
                const dayIndex = labels.indexOf(item.label);
                date.setDate(date.getDate() - (6 - dayIndex));
                return date.toLocaleString("default", { weekday: "long", month: "short", day: "numeric" });
              }
              case "1 Month": {
                date.setDate(date.getDate() - (29 - labels.indexOf(item.label)));
                return date.toLocaleString("default", { weekday: "long", month: "short", day: "numeric" });
              }
              case "3 Months": {
                date.setMonth(date.getMonth() - (2 - labels.indexOf(item.label)));
                return date.toLocaleString("default", { month: "long", year: "numeric" });
              }
              case "1 Year": {
                date.setMonth(date.getMonth() - (11 - labels.indexOf(item.label)));
                return date.toLocaleString("default", { month: "long", year: "numeric" });
              }
              default:
                return item.label;
            }
          },
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (value === 0) return void 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: "category",
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          font: {
            size: 11,
            weight: 500
          },
          maxRotation: 0,
          padding: 8,
          callback(value, index) {
            if (period === "1 Month" && index !== 0 && index !== 29 && index % 5 !== 0) {
              return "";
            }
            return String(value);
          }
        }
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        border: {
          display: false
        },
        grid: {
          color: "rgb(55, 65, 81)",
          drawBorder: false,
          lineWidth: 0.5
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          padding: 8,
          font: {
            size: 11,
            weight: 500
          },
          stepSize: 1,
          callback(value) {
            return String(value);
          }
        }
      }
    }
  };
  const enhancedData = {
    labels,
    datasets: data.map((dataset) => ({
      ...dataset,
      tension: 0.4,
      pointRadius: dataset.data.some((value) => value > 0) ? 4 : 0,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      borderWidth: 2.5,
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        const color = dataset.borderColor.replace("rgb", "rgba").replace(")", "");
        gradient.addColorStop(0, `${color}, 0.2)`);
        gradient.addColorStop(1, `${color}, 0.0)`);
        return gradient;
      }
    }))
  };
  const hasData = data.some((dataset) => dataset.data.some((value) => value > 0));
  if (!hasData) {
    return /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gray-900/30 backdrop-blur-sm rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 font-medium", children: "No data available for this period" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(Line, { options, data: enhancedData }) });
}
export {
  TicketChart as default
};
