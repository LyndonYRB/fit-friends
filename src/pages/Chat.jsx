// Chat screen
// src/pages/Chat.jsx
import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Send } from "lucide-react";
import { useAppState } from "../state/AppState.jsx";

/* =========================================================
   FALLBACK PEER
   - Used when arriving directly via /chat/:id with no state
========================================================= */

function buildFallbackPeer(id) {
  return {
    id,
    name: "Athlete",
    subtitle: "Training Partner",
    avatar:
      "https://images.unsplash.com/photo-1520975958225-8f11f3c3d5b8?auto=format&fit=crop&w=300&q=80",
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { conversations, matches, sendMessage, reportUser, blockUser } = useAppState();

  /* =========================================================
     PEER (Who you're chatting with)
     Priority:
       1) navigation state user
       2) match row (name/avatar/subtitle)
       3) fallback placeholder
  ========================================================= */

  const peer = useMemo(() => {
    const fromState = location.state?.user;
    if (fromState?.id) return fromState;

    const match = (matches || []).find((m) => m.userId === id);
    if (match) {
      return {
        id: match.userId,
        name: match.name,
        subtitle: match.subtitle || "Training Partner",
        avatar: match.avatar || buildFallbackPeer(id).avatar,
      };
    }

    return buildFallbackPeer(id);
  }, [id, location.state, matches]);

  /* =========================================================
     CONVERSATION
  ========================================================= */

  const convo = useMemo(() => {
    return (conversations || []).find((c) => c.userId === id) || null;
  }, [conversations, id]);

  const messages = convo?.messages || [];

  /* =========================================================
     COMPOSER
  ========================================================= */

  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t) return;

    sendMessage({ toUserId: id, text: t });
    setText("");
  };

  /* =========================================================
     NAV: OPEN PROFILE FROM CHAT HEADER
  ========================================================= */

  const goToProfile = () => {
    // Send state so ProfileView loads instantly, but it also works
    // without state because ProfileView already falls back by id.
    navigate(`/profile-view/${peer.id}`, { state: { user: peer } });
  };

  /* =========================================================
     REPORT / BLOCK (Header safety action)
  ========================================================= */

  const handleReport = () => {
    const reason = window.prompt("Report reason? (spam, harassment, fake profile, etc.)");
    if (!reason) return;

    const details = window.prompt("Any details? (optional)") || "";
    reportUser({ targetUserId: id, reason, details });

    const alsoBlock = window.confirm("Report submitted. Block this user too?");
    if (alsoBlock) {
      blockUser(id);
      navigate("/discover");
    } else {
      window.alert("Report submitted. Thank you.");
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* =====================================================
           HEADER
        ====================================================== */}
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#101c22]/80 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>

            {/* CLICKABLE PEER (avatar + name) */}
            <button
              type="button"
              onClick={goToProfile}
              className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-white/5 active:bg-white/10"
              aria-label="Open profile"
              title="View profile"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="leading-tight text-left">
                <div className="text-sm font-extrabold text-white">{peer.name}</div>
                <div className="text-xs font-semibold text-slate-400">{peer.subtitle}</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleReport}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
              aria-label="Report"
              title="Report / Block"
            >
              <ShieldAlert className="h-6 w-6 text-white" />
            </button>
          </div>
        </header>

        {/* =====================================================
           MESSAGES
        ====================================================== */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
          {messages.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              No messages yet. Say hi 👋
            </div>
          ) : (
            messages.map((m, idx) => {
              const mine = m.from === "me";
              const timeLabel =
                m.time ||
                (m.createdAt
                  ? new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "");

              return (
                <div
                  key={m.id || idx}
                  className={["flex", mine ? "justify-end" : "justify-start"].join(" ")}
                >
                  <div
                    className={[
                      "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                      mine
                        ? "bg-[#13a4ec] text-white rounded-br-md"
                        : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-md",
                    ].join(" ")}
                  >
                    <div>{m.text}</div>
                    <div className="mt-1 text-[11px] font-semibold opacity-80">
                      {timeLabel}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>

        {/* =====================================================
           COMPOSER
        ====================================================== */}
        <footer className="sticky bottom-0 border-t border-white/10 bg-[#101c22]/80 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="h-12 flex-1 rounded-full border border-white/10 bg-[#101c22] px-4 text-sm font-semibold text-white placeholder:text-slate-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button
              type="button"
              onClick={send}
              className="grid h-12 w-12 place-items-center rounded-full bg-[#13a4ec] text-white shadow-lg shadow-black/20 hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
              aria-label="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
