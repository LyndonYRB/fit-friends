//Messages list page
// src/pages/Messages.jsx
import { Link } from "react-router-dom";
import { Compass, MessageCircle, User, Search, ChevronRight } from "lucide-react";

const threads = [
  {
    id: "alex",
    name: "Alex",
    subtitle: "Intermediate Runner",
    lastMessage: "Down for a run tomorrow morning?",
    time: "2m",
    unread: 2,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
  },
  {
    id: "sophia",
    name: "Sophia",
    subtitle: "Advanced Yoga",
    lastMessage: "I usually go evenings. What days work for you?",
    time: "1h",
    unread: 0,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY91asyYLfhpDr89J9P6ljRB0YcE4tCuPcWKfM6HEHfli9RvDI2rQcjWSIAcve5-HSbCLDRLyrvYkK3CpHjT5Fga2cq0VnV3G1HHTYkrvl-icx4FRI1uqZpGNQt-ApWcu_-TP6Q_AakgIPI6a3K6uHl_PO44BBWPAxVySzTI2luHuouWViAqDzAehUQijojKvK7b5OgABOu3rbi1J2WRKKGS--PyrI8ho3RBaxRQTqxBSnnG-CeTCU5sX6A4_Twn2nHApD0DJEn6u",
  },
  {
    id: "ethan",
    name: "Ethan",
    subtitle: "Beginner Weightlifter",
    lastMessage: "Leg day today 💀 wanna train?",
    time: "Yesterday",
    unread: 0,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4TjRKEhM45QPM48QMXjVwYvZslZ3HZUzRj4oRA0YEPDus4p2JKc1r2FBPTYRla_DXKk-YnFLDE0W1ZUPtZoPDVB7Z5MY1OgZQH1SAsv4gZTZdIRAU0dBX0vK1hVRY-a4cVX1WNT_pQdUsHSfJgwMMH_iWQBPbJdM_KSFkn9SgNRtTBPZxVO86Ndb-VJSINTMNASZX0uQaiVWrgdv6gMQzmEE6ar0HsISmwYKK2m2Wsu3FvXfN4VDfvVTqKzOiC_dLhXOq5N7LTFe",
  },
];

export default function Messages() {
  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
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

        {/* List */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
          <div className="space-y-3">
            {threads.map((t) => (
              <Link
                key={t.id}
                to={`/chat/${t.id}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
              >
                <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5">
                  <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
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
            ))}
          </div>
        </main>

        {/* Bottom nav */}
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
