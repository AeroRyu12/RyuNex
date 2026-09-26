import { io } from "socket.io-client";
const getSocketUrl = () => {
  if (window.DASHBOARD_CONFIG?.CLIENT_URL) {
    return window.DASHBOARD_CONFIG.CLIENT_URL;
  }
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
};
const API_URL = getSocketUrl();
const isFirefox = navigator.userAgent.includes("Firefox");
const socket = io(API_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: isFirefox ? 10 : 5,
  reconnectionDelay: isFirefox ? 2e3 : 1e3,
  reconnectionDelayMax: isFirefox ? 1e4 : 5e3,
  withCredentials: true,
  transports: isFirefox ? ["polling"] : ["polling", "websocket"],
  upgrade: !isFirefox,
  path: "/socket.io/",
  forceNew: false,
  timeout: isFirefox ? 6e4 : 2e4,
  rememberUpgrade: false,
  randomizationFactor: 0.5
});
let currentRoom = null;
socket.on("connect", () => {
  if (currentRoom) {
    socket.emit("join_ticket", currentRoom);
  }
});
socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect" || reason === "transport close") {
    socket.connect();
  }
});
socket.on("connect_error", (error) => {
  if (isFirefox) {
    setTimeout(() => {
      if (!socket.connected) {
        socket.connect();
      }
    }, 3e3);
  } else {
    setTimeout(() => {
      socket.connect();
    }, 1e3);
  }
});
socket.onAny((event, ...args) => {
});
socket.onAnyOutgoing((event, ...args) => {
});
const joinTicketRoom = (ticketId) => {
  if (currentRoom === ticketId) {
    return;
  }
  if (currentRoom) {
    socket.emit("leave_ticket", currentRoom);
  }
  socket.emit("join_ticket", ticketId);
  currentRoom = ticketId;
  socket.emit("get_ticket_messages", ticketId);
};
socket.on("ticketMessage", (data) => {
  socket.emit("message_received", { messageId: data?.message?.id });
});
socket.on("ticket_message", (data) => {
  socket.emit("message_received", { messageId: data?.message?.id });
});
socket.on("message", (data) => {
  socket.emit("message_received", { messageId: data?.message?.id });
});
socket.on("discord_message", (data) => {
  socket.emit("message_received", { messageId: data?.message?.id });
});
socket.on("discordMessage", (data) => {
  socket.emit("message_received", { messageId: data?.message?.id });
});
socket.on("discord", (data) => {
  socket.emit("message_received", { messageId: data?.message?.id });
});
socket.on("joined_room", (room) => {
});
socket.on("left_room", (room) => {
  if (currentRoom === room) {
    currentRoom = null;
  }
});
export {
  joinTicketRoom,
  socket
};
