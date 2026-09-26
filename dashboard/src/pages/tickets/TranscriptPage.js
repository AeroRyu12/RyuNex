import { jsx } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import TicketTranscript from "../../components/tickets/components/TicketTranscript";
function TranscriptPage() {
  const { id } = useParams();
  if (!id) {
    return /* @__PURE__ */ jsx("div", { className: "text-center text-red-500", children: "Invalid ticket ID" });
  }
  return /* @__PURE__ */ jsx(TicketTranscript, { ticketId: id });
}
export {
  TranscriptPage as default
};
