import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPaperclip,
  faPaperPlane,
  faTicket,
  faHandHolding,
  faLock,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { userDataService } from "../../../utils/userDataService";
import moment from "moment-timezone";
import LoadingSpinner from "../../ui/LoadingSpinner";
const getCsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
const ImageViewer = ({ src, alt, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4",
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "fixed top-4 right-4 glass-card hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full p-3 transition-colors z-[60]",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative max-w-[95vw] max-h-[95vh]", onClick: (e) => e.stopPropagation(), children: [
          loading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" }) }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src,
              alt,
              className: `rounded-xl max-w-full max-h-[90vh] object-contain shadow-2xl cursor-zoom-in ring-1 ring-border transition-transform ${zoomed ? "scale-150" : ""}`,
              onClick: () => setZoomed(!zoomed),
              onLoad: () => setLoading(false)
            }
          )
        ] })
      ]
    }
  );
};
function groupMessages(messages) {
  return messages.reduce((groups, message) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.authorId === message.authorId) {
      lastGroup.messages.push({
        content: message.content,
        timestamp: message.timestamp,
        attachments: message.attachments
      });
      return groups;
    } else {
      groups.push({
        author: message.author,
        authorId: message.authorId,
        displayName: message.displayName || message.author,
        avatarUrl: message.avatarUrl,
        messages: [{
          content: message.content,
          timestamp: message.timestamp,
          attachments: message.attachments
        }],
        firstTimestamp: message.timestamp
      });
      return groups;
    }
  }, []);
}
const MessageContent = ({ content }) => {
  const processContent = (text) => {
    const escapeHtml = (unsafe) => {
      return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };
    let processedText = escapeHtml(text);
    processedText = processedText.replace(/&lt;@!?(\d+)&gt;/g, '<span class="text-primary bg-primary/10 px-1 rounded">@user</span>');
    processedText = processedText.replace(/&lt;#(\d+)&gt;/g, '<span class="text-primary bg-primary/10 px-1 rounded">#channel</span>');
    processedText = processedText.replace(/&lt;@&amp;(\d+)&gt;/g, '<span class="text-primary bg-primary/10 px-1 rounded">@role</span>');
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    processedText = processedText.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>");
    processedText = processedText.replace(/~~(.*?)~~/g, '<del class="text-muted-foreground">$1</del>');
    processedText = processedText.replace(/```([\s\S]*?)```/g, '<pre class="bg-secondary p-2 rounded-lg my-1 overflow-x-auto text-sm"><code>$1</code></pre>');
    processedText = processedText.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>');
    processedText = processedText.replace(/\n/g, "<br>");
    return processedText;
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "whitespace-pre-wrap break-words text-foreground/90 leading-relaxed text-sm",
      dangerouslySetInnerHTML: { __html: processContent(content) }
    }
  );
};
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = moment.tz(timestamp, window.DASHBOARD_CONFIG?.TIMEZONE || "UTC");
  return date.isValid() ? date.format("h:mm A") : "";
};
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = moment.tz(timestamp, window.DASHBOARD_CONFIG?.TIMEZONE || "UTC");
  return date.isValid() ? date.format("MMM D, YYYY") : "";
};
const getAvatarUrl = (userId) => {
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
};
const AttachmentDisplay = ({ attachment }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  if (attachment.contentType?.startsWith("image/")) {
    const imageSrc = attachment.binaryData ? `data:${attachment.contentType};base64,${attachment.binaryData}` : attachment.url;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: imageSrc,
          alt: attachment.name,
          className: "max-w-xs rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity",
          onClick: () => setSelectedImage({ src: imageSrc, alt: attachment.name })
        }
      ),
      selectedImage && /* @__PURE__ */ jsx(
        ImageViewer,
        {
          src: selectedImage.src,
          alt: selectedImage.alt,
          onClose: () => setSelectedImage(null)
        }
      )
    ] });
  }
  if (attachment.url) {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: attachment.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors",
        children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPaperclip, className: "w-3 h-3" }),
          /* @__PURE__ */ jsx("span", { className: "truncate max-w-[200px]", children: attachment.name })
        ]
      }
    );
  }
  return null;
};
function TicketTranscript({ ticketId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState({ fetch: true, claim: false, close: false });
  const [error, setError] = useState(null);
  const [supportPermissions, setSupportPermissions] = useState({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingEnabled, setSendingEnabled] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const groupedMessages = useMemo(() => data ? groupMessages(data.messages) : [], [data?.messages]);
  const hasFeedback = useMemo(() => {
    if (!data) return false;
    if (data.reviewData) {
      const hasReviewItems = Object.entries(data.reviewData).filter(([key, val]) => key !== "additionalFeedback" && val && typeof val === "object" && "value" in val).length > 0;
      const hasAdditionalFeedback = !!data.reviewData.additionalFeedback;
      return hasReviewItems || hasAdditionalFeedback;
    }
    return data.rating && data.rating !== "No Rating" || !!data.feedback;
  }, [data]);
  useEffect(() => {
    let isMounted = true;
    async function fetchTranscript() {
      try {
        const response = await fetch(`/api/tickets/${ticketId}/transcript`);
        if (!response.ok) {
          if (response.status === 403) {
            setError("You don't have permission to view this ticket");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const creatorData = await userDataService.getUserData(result.creator);
        let claimerData;
        if (result.claimer && result.claimer !== "Unclaimed") {
          claimerData = await userDataService.getUserData(result.claimer);
        }
        const enhancedMessages = await Promise.all(
          result.messages.map(async (msg) => {
            const userData = await userDataService.getUserData(msg.authorId);
            return {
              ...msg,
              displayName: userData?.displayName || msg.author,
              avatarUrl: userData?.avatar || getAvatarUrl(msg.authorId)
            };
          })
        );
        if (isMounted) {
          setData({
            ...result,
            creatorData: creatorData || void 0,
            claimerData: claimerData || void 0,
            claimed: Boolean(result.claimer) && result.claimer !== "Unclaimed",
            messages: enhancedMessages
          });
          setLoading((prev) => ({ ...prev, fetch: false }));
        }
      } catch (error2) {
        if (isMounted) {
          setError("Failed to load transcript");
          setLoading((prev) => ({ ...prev, fetch: false }));
        }
      }
    }
    fetchTranscript();
    const pollInterval = setInterval(fetchTranscript, 5e3);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [ticketId]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);
  useEffect(() => {
    const checkSupportPermissions = async () => {
      if (!data?.type) return;
      try {
        const response = await fetch(`/api/tickets/permissions/${data.type}`);
        if (response.ok) {
          const { hasSupport } = await response.json();
          setSupportPermissions((prev) => ({ ...prev, [data.type]: hasSupport }));
        }
      } catch (error2) {
      }
    };
    checkSupportPermissions();
  }, [data?.type]);
  const sendMessage = async () => {
    if (!message.trim() || !sendingEnabled) return;
    setSending(true);
    setSendingEnabled(false);
    const messageContent = message;
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/tickets/${ticketId}/send-message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        },
        body: JSON.stringify({ content: messageContent })
      });
      if (response.ok) {
        setMessage("");
        const currentUser = await userDataService.getCurrentUser();
        const newMessage = {
          author: currentUser?.displayName || "You",
          authorId: currentUser?.id || "local",
          content: messageContent,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          avatarUrl: currentUser?.avatar || "/default-avatar.png",
          displayName: currentUser?.displayName || "You"
        };
        setData((prev) => prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev);
      }
    } finally {
      setSending(false);
      setTimeout(() => setSendingEnabled(true), 500);
    }
  };
  const handleClaimTicket = async () => {
    try {
      setLoading((prev) => ({ ...prev, claim: true }));
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/tickets/claim/${ticketId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        }
      });
      if (response.ok) {
        const result = await response.json();
        setData((prev) => {
          if (!prev) return prev;
          if (result.action === "unclaimed") {
            return { ...prev, claimed: false, claimer: null, claimerData: void 0 };
          }
          return { ...prev, claimed: true, claimer: result.ticket.claimedBy };
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, claim: false }));
    }
  };
  const handleCloseTicket = async () => {
    const reason = prompt("Enter a reason for closing (optional):");
    if (reason === null) return;
    try {
      setLoading((prev) => ({ ...prev, close: true }));
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/tickets/close/${ticketId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...csrfToken && { "X-XSRF-TOKEN": csrfToken }
        },
        body: JSON.stringify({ reason })
      });
      if (response.ok) {
        setData((prev) => prev ? { ...prev, status: "closed", closed: (/* @__PURE__ */ new Date()).toISOString(), closeReason: reason || "" } : prev);
      }
    } finally {
      setLoading((prev) => ({ ...prev, close: false }));
    }
  };
  if (loading.fetch) return /* @__PURE__ */ jsx(LoadingSpinner, {});
  if (error) return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/tickets", className: "inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4", children: [
      /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faArrowLeft, className: "w-4 h-4" }),
      "Back"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-destructive/10 text-destructive p-4 rounded-lg", children: error })
  ] });
  if (!data) return null;
  const canPerformActions = data.status === "open" && supportPermissions[data.type];
  const isClaimed = Boolean(data.claimer) && data.claimer !== "Unclaimed";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-20 px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 max-w-[1600px] mx-auto glass-card rounded-xl px-4 py-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/tickets", className: "text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faArrowLeft, className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faTicket, className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
            "#",
            data.id
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: data.typeName || data.type })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-medium ${data.status === "open" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`, children: data.status })
      ] }),
      canPerformActions && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleClaimTicket,
            disabled: loading.claim,
            className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isClaimed ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-primary/10 text-primary hover:bg-primary/20"}`,
            children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faHandHolding, className: "w-3 h-3 mr-1.5" }),
              loading.claim ? "..." : isClaimed ? "Unclaim" : "Claim"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleCloseTicket,
            disabled: loading.close,
            className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors",
            children: [
              /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLock, className: "w-3 h-3 mr-1.5" }),
              loading.close ? "..." : "Close"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsx("div", { className: "max-w-[1600px] mx-auto p-4 lg:p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-8", children: [
        data.questions && data.questions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl mb-4 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-border text-sm font-medium text-foreground", children: [
            "Questions (",
            data.questions.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: data.questions.map((q, index) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setExpandedQuestion(expandedQuestion === index ? null : index),
                className: "w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: q.question }),
                  /* @__PURE__ */ jsx(
                    FontAwesomeIcon,
                    {
                      icon: faChevronDown,
                      className: `w-3 h-3 text-muted-foreground transition-transform ${expandedQuestion === index ? "rotate-180" : ""}`
                    }
                  )
                ]
              }
            ),
            expandedQuestion === index && /* @__PURE__ */ jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsx("div", { className: "bg-secondary/50 rounded-lg px-3 py-2 text-sm text-muted-foreground", children: q.answer }) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: groupedMessages.map((group, index) => /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: group.avatarUrl || getAvatarUrl(group.authorId),
                alt: "",
                className: "w-8 h-8 rounded-full flex-shrink-0"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-sm text-foreground", children: group.displayName }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: formatTime(group.firstTimestamp) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: group.messages.map((msg, msgIndex) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(MessageContent, { content: msg.content }),
                msg.attachments && msg.attachments.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: msg.attachments.map((att, attIndex) => /* @__PURE__ */ jsx(AttachmentDisplay, { attachment: att }, attIndex)) })
              ] }, msgIndex)) })
            ] })
          ] }) }, `${group.authorId}-${index}`)) }),
          /* @__PURE__ */ jsx("div", { ref: messagesEndRef }),
          data.canSendMessages && data.status === "open" && /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-border bg-card/50", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                ref: textareaRef,
                value: message,
                onChange: (e) => setMessage(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                },
                placeholder: "Type a message...",
                className: "flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none",
                rows: 1
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: sendMessage,
                disabled: !message.trim() || !sendingEnabled || sending,
                className: `px-4 rounded-lg transition-colors ${message.trim() && sendingEnabled && !sending ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-muted-foreground cursor-not-allowed"}`,
                children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faPaperPlane, className: `w-4 h-4 ${sending ? "animate-pulse" : ""}` })
              }
            )
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-4 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-3", children: "Details" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Priority" }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-xs font-medium ${data.priority === "high" ? "bg-rose-500/10 text-rose-400" : data.priority === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-teal-500/10 text-teal-400"}`, children: data.priority })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Created" }),
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: formatDate(data.created) })
            ] }),
            data.closed && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Closed" }),
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: formatDate(data.closed) })
            ] }),
            isClaimed && data.claimerData && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Claimed by" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("img", { src: data.claimerData.avatar, alt: "", className: "w-5 h-5 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-foreground", children: data.claimerData.displayName })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-3", children: "Created by" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: data.creatorData?.avatar || getAvatarUrl(data.creator),
                alt: "",
                className: "w-10 h-10 rounded-full"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: data.creatorData?.displayName || data.creator }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: data.creator })
            ] })
          ] })
        ] }),
        data.messages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-foreground mb-3", children: [
            "Participants (",
            Array.from(new Set(data.messages.map((m) => m.authorId))).length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: Array.from(new Set(data.messages.map((m) => m.authorId))).slice(0, 5).map((authorId) => {
            const msg = data.messages.find((m) => m.authorId === authorId);
            if (!msg) return null;
            const count = data.messages.filter((m) => m.authorId === authorId).length;
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("img", { src: msg.avatarUrl, alt: "", className: "w-6 h-6 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground truncate", children: msg.displayName || msg.author })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: count })
            ] }, authorId);
          }) })
        ] }),
        hasFeedback && /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-3", children: "Feedback" }),
          data.reviewData ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            Object.entries(data.reviewData).filter(([key, val]) => key !== "additionalFeedback" && val && typeof val === "object" && "value" in val).map(([key, val]) => {
              const item = val;
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground capitalize", children: key.replace(/_/g, " ") }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  item.emoji && /* @__PURE__ */ jsx("span", { children: item.emoji }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: item.label })
                ] })
              ] }, key);
            }),
            data.reviewData.additionalFeedback && /* @__PURE__ */ jsx("div", { className: "mt-2 pt-2 border-t border-border", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: data.reviewData.additionalFeedback }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            data.rating && data.rating !== "No Rating" && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Rating" }),
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: data.rating })
            ] }),
            data.feedback && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: data.feedback })
          ] })
        ] }),
        data.closeReason && /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2", children: "Close Reason" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: data.closeReason })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  TicketTranscript as default
};
