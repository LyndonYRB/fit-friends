// Messages list page
// src/pages/MessagesList.jsx
import { Link } from "react-router-dom";
import { Compass, MessageCircle, User, Search, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useAppState } from "../state/AppState.jsx";

/* =========================================================
   TIME LABEL HELPER (simple + readable)
========================================================= */

function formatRelativeTime(iso) {
  if (!iso) return "";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "";

  const now = new Date();
  const diffMs = now - t;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Now";
  if (diffMin < 60) return `${diffMin}m`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  return `${diffDay}d`;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MessagesList() {
  const { matches, conversations, blockedUserIds } = useAppState();

  const threads = useMemo(() => {
    const convoByUserId = new Map((conversations || []).map((c) => [c.userId, c]));

    const safeMatches = matches || [];
    const blocked = blockedUserIds || [];

    return safeMatches
      .filter((m) => !blocked.includes(m.userId))
      .map((m) => {
        const convo = convoByUserId.get(m.userId);
        const updatedAt = convo?.updatedAt || m.updatedAt || null;

        return {
          id: m.userId,
          name: m.name,
          subtitle: m.subtitle,
          lastMessage: m.lastMessage || "Say hi 👋",
          time: formatRelativeTime(updatedAt),
          unread: m.unreadCount || 0,
          avatar: m.avatar,
          updatedAtRaw: updatedAt ? new Date(updatedAt).getTime() : 0,
        };
      })
      .sort((a, b) => b.updatedAtRaw - a.updatedAtRaw);
  }, [matches, conversations, blockedUserIds]);

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* =====================================================
           HEADER
        ====================================================== */}
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#101c22]/80 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Messages</h1>
            <div className="text-xs font-semibold text-slate-400">
              {threads.length} chats
            </div>
          </div>

          {/* Search (UI-only) */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search messages"
              className="h-12 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-sm font-semibold text-white placeholder:text-slate-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
            />
          </div>
        </header>

        {/* =====================================================
           LIST
        ====================================================== */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
          <div className="space-y-3">
            {threads.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                No chats yet. Go to Discover and Connect with someone.
              </div>
            ) : (
              threads.map((t) => (
                <Link
                  key={t.id}
                  to={`/chat/${t.id}`}
                  state={{
                    user: {
                      id: t.id,
                      name: t.name,
                      subtitle: t.subtitle,
                      avatar: t.avatar,
                    },
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    <img
                      src={t.avatar || "https://via.placeholder.com/96"}
                      alt={t.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-extrabold text-white">
                        {t.name}
                      </div>
                      <div className="shrink-0 text-xs font-semibold text-slate-400">
                        {t.time}
                      </div>
                    </div>

                    <div className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                      {t.subtitle}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="truncate text-sm text-slate-300">
                        {t.lastMessage}
                      </div>

                      <div className="flex items-center gap-2">
                        {t.unread > 0 ? (
                          <span className="grid h-6 min-w-[24px] place-items-center rounded-full bg-[#13a4ec] px-2 text-xs font-extrabold text-white">
                            {t.unread}
                          </span>
                        ) : null}
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>

        {/* =====================================================
           BOTTOM NAV
        ====================================================== */}
        <nav className="sticky bottom-0 border-t border-slate-700/80 bg-[#101c22]/80 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-2 px-4 py-2">
            <Link
              to="/discover"
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-slate-400"
            >
              <Compass className="h-6 w-6" />
              <span className="text-xs font-medium">Discover</span>
            </Link>

            <Link
              to="/messages"
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-[#13a4ec]"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-medium">Messages</span>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-slate-400"
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
