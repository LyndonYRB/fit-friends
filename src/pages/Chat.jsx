//Chat screen
// src/pages/Chat.jsx
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Send } from "lucide-react";

const mockUsers = {
  alex: {
    name: "Alex",
    subtitle: "Intermediate Runner",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
  },
  sophia: {
    name: "Sophia",
    subtitle: "Advanced Yoga",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY91asyYLfhpDr89J9P6ljRB0YcE4tCuPcWKfM6HEHfli9RvDI2rQcjWSIAcve5-HSbCLDRLyrvYkK3CpHjT5Fga2cq0VnV3G1HHTYkrvl-icx4FRI1uqZpGNQt-ApWcu_-TP6Q_AakgIPI6a3K6uHl_PO44BBWPAxVySzTI2luHuouWViAqDzAehUQijojKvK7b5OgABOu3rbi1J2WRKKGS--PyrI8ho3RBaxRQTqxBSnnG-CeTCU5sX6A4_Twn2nHApD0DJEn6u",
  },
  ethan: {
    name: "Ethan",
    subtitle: "Beginner Weightlifter",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4TjRKEhM45QPM48QMXjVwYvZslZ3HZUzRj4oRA0YEPDus4p2JKc1r2FBPTYRla_DXKk-YnFLDE0W1ZUPtZoPDVB7Z5MY1OgZQH1SAsv4gZTZdIRAU0dBX0vK1hVRY-a4cVX1WNT_pQdUsHSfJgwMMH_iWQBPbJdM_KSFkn9SgNRtTBPZxVO86Ndb-VJSINTMNASZX0uQaiVWrgdv6gMQzmEE6ar0HsISmwYKK2m2Wsu3FvXfN4VDfvVTqKzOiC_dLhXOq5N7LTFe",
  },
};

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const peer = useMemo(() => mockUsers[id] ?? mockUsers.alex, [id]);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { from: "them", text: "Hey! What days do you usually train?", time: "9:12 AM" },
    { from: "me", text: "Mostly mornings. I'm flexible on weekends too.", time: "9:14 AM" },
    { from: "them", text: "Nice — want to do a session this week?", time: "9:18 AM" },
  ]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { from: "me", text: t, time: "Now" }]);
    setText("");
  };

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
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

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <img src={peer.avatar} alt={peer.name} className="h-full w-full object-cover" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-extrabold text-white">{peer.name}</div>
                <div className="text-xs font-semibold text-slate-400">{peer.subtitle}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Report flow later")}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
              aria-label="Report"
            >
              <ShieldAlert className="h-6 w-6 text-white" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
          {messages.map((m, idx) => {
            const mine = m.from === "me";
            return (
              <div
                key={idx}
                className={[
                  "flex",
                  mine ? "justify-end" : "justify-start",
                ].join(" ")}
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
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}
        </main>

        {/* Composer */}
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
