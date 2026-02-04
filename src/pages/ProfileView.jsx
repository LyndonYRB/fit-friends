// View Profiles
// src/pages/ProfileView.jsx
import { useMemo } from "react";
import { getMockUserById } from "../data/mockUsers.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Trophy,
  Star,
  Clock,
  ShieldAlert,
  Ban,
  HeartHandshake,
} from "lucide-react";
import { useAppState } from "../state/AppState.jsx";

/* =========================================================
   FALLBACK USER (prevents crashes if route state is missing)
========================================================= */

const FALLBACK_USER = {
  id: "u_fallback",
  name: "Alex",
  age: 28,
  subtitle: "Intermediate Runner",
  distance: "5km away",
  location: "New York, NY",
  bio: "Training for a 10K. I like early runs + weekend long runs. Down for mobility work after.",
  photos: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
  ],
  interests: ["Running", "Gym", "Mobility"],
  skill: "Intermediate",
  availability: "Morning",
};

/* =========================================================
   CHIP COMPONENT
========================================================= */

const Chip = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <div className="text-white/60">{icon}</div>
    <div className="flex-1">
      <div className="text-xs font-semibold text-gray-400">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  </div>
);

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { connectUser, blockUser, reportUser } = useAppState();

  /* =========================================================
     USER RESOLVE
     Priority:
       1) route state user
       2) mock user by id
       3) fallback user
  ========================================================= */

  const user = useMemo(() => {
    const u = location?.state?.user;
    if (u && (u.name || u.id)) return u;

    if (id) {
      const fromMock = getMockUserById(id);
      if (fromMock) return fromMock;
    }

    return FALLBACK_USER;
  }, [location?.state?.user, id]);

  /* =========================================================
     SAFE DERIVED FIELDS
  ========================================================= */

  const interests = Array.isArray(user?.interests) ? user.interests : [];
  const primaryInterest = interests[0] || "Training";

  const photo =
    (Array.isArray(user?.photos) && user.photos[0]) ||
    user?.avatar ||
    user?.photo ||
    "https://images.unsplash.com/photo-1520975958225-8f11f3c3d5b8?auto=format&fit=crop&w=900&q=80";

  const avatar =
    user?.avatar ||
    user?.photo ||
    (Array.isArray(user?.photos) ? user.photos[0] : null) ||
    null;

  /* =========================================================
     ACTIONS
  ========================================================= */

  const onConnect = () => {
    connectUser(user);

    navigate(`/chat/${user.id}`, {
      state: {
        user: {
          id: user.id,
          name: user.name,
          subtitle: user.subtitle,
          avatar,
        },
      },
    });
  };

  const onReport = () => {
    reportUser({
      targetUserId: user.id,
      reason: "Inappropriate behavior",
      details: "",
    });
    alert("Reported (local only for now).");
  };

  const onBlock = () => {
    blockUser(user.id);
    navigate("/discover");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#101c22]/80 px-4 py-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>

          <h1 className="text-lg font-bold text-white">Profile View</h1>
          <div className="w-10" />
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-28 space-y-5">
          {/* Photo */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div
              className="h-[340px] w-full bg-cover bg-center"
              style={{ backgroundImage: `url("${photo}")` }}
            />
          </div>

          {/* Name + meta */}
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              {user.name || "Athlete"}
              {user.age ? `, ${user.age}` : ""}
            </h2>
            <p className="mt-1 text-slate-400">{user.subtitle || "Training Partner"}</p>

            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <MapPin className="h-5 w-5" />
              <span className="text-base">
                {user.location || "Nearby"} {user.distance ? `• ${user.distance}` : ""}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-gray-400">About</div>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              {user.bio || "No bio yet."}
            </p>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-400">Activity interests</div>
            {interests.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                No interests listed.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {interests.map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200"
                  >
                    {x}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <Chip
              icon={<Trophy className="h-5 w-5" />}
              label="Sport / Focus"
              value={primaryInterest}
            />
            <Chip
              icon={<Star className="h-5 w-5" />}
              label="Skill level"
              value={user.skill || "Any"}
            />
            <Chip
              icon={<Clock className="h-5 w-5" />}
              label="Availability"
              value={user.availability || "Flexible"}
            />
          </div>

          {/* Safety actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onReport}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
            >
              <ShieldAlert className="h-5 w-5 text-white/70" />
              Report
            </button>

            <button
              type="button"
              onClick={onBlock}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
            >
              <Ban className="h-5 w-5 text-white/70" />
              Block
            </button>
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="sticky bottom-0 border-t border-white/10 bg-[#101c22]/80 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={onConnect}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
          >
            <HeartHandshake className="h-5 w-5" />
            Connect
          </button>
        </footer>
      </div>
    </div>
  );
}
