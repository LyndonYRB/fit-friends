// src/pages/Discover.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppState } from "../state/AppState";
import {
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Compass,
  MessageCircle,
  User,
  X,
  Heart,
  Star,
} from "lucide-react";

/* -------------------- Mock cards -------------------- */
const cards = [
  {
    name: "Alex, 28",
    subtitle: "Intermediate Runner",
    distance: "5km away",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
    z: 30,
    hover: true,
  },
  {
    name: "Sophia, 25",
    subtitle: "Advanced Yoga",
    distance: "10km away",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY91asyYLfhpDr89J9P6ljRB0YcE4tCuPcWKfM6HEHfli9RvDI2rQcjWSIAcve5-HSbCLDRLyrvYkK3CpHjT5Fga2cq0VnV3G1HHTYkrvl-icx4FRI1uqZpGNQt-ApWcu_-TP6Q_AakgIPI6a3K6uHl_PO44BBWPAxVySzTI2luHuouWViAqDzAehUQijojKvK7b5OgABOu3rbi1J2WRKKGS--PyrI8ho3RBaxRQTqxBSnnG-CeTCU5sX6A4_Twn2nHApD0DJEn6u",
    z: 20,
  },
  {
    name: "Ethan, 31",
    subtitle: "Beginner Weightlifter",
    distance: "2km away",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4TjRKEhM45QPM48QMXjVwYvZslZ3HZUzRj4oRA0YEPDus4p2JKc1r2FBPTYRla_DXKk-YnFLDE0W1ZUPtZoPDVB7Z5MY1OgZQH1SAsv4gZTZdIRAU0dBX0vK1hVRY-a4cVX1WNT_pQdUsHSfJgwMMH_iWQBPbJdM_KSFkn9SgNRtTBPZxVO86Ndb-VJSINTMNASZX0uQaiVWrgdv6gMQzmEE6ar0HsISmwYKK2m2Wsu3FvXfN4VDfvVTqKzOiC_dLhXOq5N7LTFe",
    z: 10,
  },
];

const ACTIVITIES = [
  "Gym",
  "Pilates",
  "Dance",
  "Running",
  "Soccer",
  "Basketball",
  "Volleyball",
  "Swimming",
  "Boxing",
];

const SKILLS = ["Any", "Beginner", "Intermediate", "Advanced"];

/* -------------------- Filter pill -------------------- */
function FilterPill({ label, value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-3",
        "text-sm font-extrabold tracking-tight transition",
        active
          ? "bg-[#9aa3ab] text-[#0b1720]"
          : "bg-[#8f99a2] text-[#0b1720] hover:bg-[#9aa3ab]",
      ].join(" ")}
    >
      <span className="opacity-90">{label}</span>
      <span className="opacity-90">{value}</span>
      <ChevronDown className="h-4 w-4 opacity-70" />
    </button>
  );
}

/* ==================== PAGE ==================== */
export default function Discover() {
  const navigate = useNavigate();
  const { prefs, updatePrefs } = useAppState();

  const [open, setOpen] = useState(null); // "sport" | "skill" | "distance" | null
  const filterRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (filterRef.current?.contains(e.target)) return;
      setOpen(null);
    };

    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  /* Prevent body scroll when dropdown is open */
  useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "";
  return () => {
    document.body.style.overflow = "";
  };
}, [open]);


/* Prefs */
const preferredActivities =
  prefs && prefs.preferredActivities ? prefs.preferredActivities : ["Gym"];

const skillPref = prefs && prefs.skillPref ? prefs.skillPref : "Any";
const radius = prefs && prefs.radius ? prefs.radius : "10";

const sportLabel = useMemo(() => {
  if (!preferredActivities.length) return "Any";
  if (preferredActivities.length === 1) return preferredActivities[0];
  return `${preferredActivities[0]} +${preferredActivities.length - 1}`;
}, [preferredActivities]);

const distanceLabel = `${radius} mi`;


  const toggleSport = (sport) => {
    const next = preferredActivities.includes(sport)
      ? preferredActivities.filter((s) => s !== sport)
      : [...preferredActivities, sport];

    updatePrefs({ preferredActivities: next.length ? next : ["Gym"] });
  };

  return (
    <div className="min-h-screen bg-[#101c22] font-[Lexend] text-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* ---------------- Header ---------------- */}
        <header className="sticky top-0 z-50 bg-[#101c22]/80 backdrop-blur-sm">

  <div className="flex items-center justify-between p-4">
    <h1 className="text-xl font-bold text-white">Find Partners</h1>

    <button
      type="button"
      onClick={() => navigate("/preference-setup")}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
      aria-label="Filters"
    >
      <SlidersHorizontal className="h-5 w-5 text-slate-200" />
    </button>
  </div>

  {/* Pills row */}
  <div ref={filterRef} className="relative px-4 pb-4">
    <div className="flex gap-3 overflow-x-auto no-scrollbar">
      <FilterPill
        label="Sport"
        value={sportLabel}
        active={open === "sport"}
        onClick={() => setOpen(open === "sport" ? null : "sport")}
      />
      <FilterPill
        label="Skill Level"
        value={skillPref}
        active={open === "skill"}
        onClick={() => setOpen(open === "skill" ? null : "skill")}
      />
      <FilterPill
        label="Distance"
        value={distanceLabel}
        active={open === "distance"}
        onClick={() => setOpen(open === "distance" ? null : "distance")}
      />
    </div>

    {/* dropdown stays here (see Step 2) */}
    {open && (
  <div className="absolute left-4 right-4 top-[56px] z-[60] rounded-2xl border border-white/10 bg-[#0f1b21] p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">

    {/* SPORT */}
    {open === "sport" && (
      <div className="space-y-3">
        <div className="text-sm font-bold text-white">Sport</div>
        <div className="flex flex-wrap gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a}
              onClick={() => toggleSport(a)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold",
                preferredActivities.includes(a)
                  ? "bg-[#13a4ec] text-white"
                  : "bg-white/5 text-gray-200 hover:bg-white/10",
              ].join(" ")}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* SKILL */}
    {open === "skill" && (
      <div className="space-y-3">
        <div className="text-sm font-bold text-white">Skill Level</div>
        <div className="grid grid-cols-2 gap-2">
          {SKILLS.map((s) => (
            <button
              key={s}
              onClick={() => {updatePrefs({ skillPref: s });setOpen(null);}}
              className={[
                "h-12 rounded-xl font-bold",
                skillPref === s
                  ? "bg-[#13a4ec]/25 text-white"
                  : "bg-white/5 text-gray-200 hover:bg-white/10",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* DISTANCE */}
    {open === "distance" && (
      <div className="space-y-4">
        <div className="text-sm font-bold text-white">
          Within {radius} miles
        </div>
        <input
          type="range"
          min="1"
          max="25"
          value={radius}
          onChange={(e) => updatePrefs({ radius: e.target.value })}
          onMouseUp={() => setOpen(null)}
          onTouchEnd={() => setOpen(null)}
          className="w-full"
        />
      </div>
    )}

    {open === "sport" && (
  <div className="mt-4 flex justify-end">
    <button
      type="button"
      onClick={() => setOpen(null)}
      className="rounded-full bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Done
    </button>
  </div>
)}

  </div>
)}

  </div>
</header>


        {/* ---------------- Main ---------------- */}
        <main className="flex-1 px-6 pt-4 pb-24">
          <div className="relative h-[60vh]">
            {cards.map((c) => (
              <div
                key={c.name}
                onClick={() => navigate("/profile-view")}
                className="absolute inset-0 z-10 cursor-pointer overflow-hidden rounded-2xl bg-slate-800 shadow-lg"
                style={{ zIndex: c.z }}
              >
                <div
                  className="h-3/5 bg-cover bg-center"
                  style={{ backgroundImage: `url(${c.img})` }}
                />
                <div className="flex h-2/5 flex-col justify-between p-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{c.name}</h2>
                    <p className="text-slate-400">{c.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-5 w-5" />
                    {c.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-6">
            <button className="h-16 w-16 rounded-full bg-slate-700 text-red-400">
              <X className="mx-auto h-9 w-9" />
            </button>
            <button className="h-20 w-20 rounded-full bg-[#13a4ec] text-white">
              <Heart className="mx-auto h-10 w-10 fill-white" />
            </button>
            <button className="h-16 w-16 rounded-full bg-slate-700 text-yellow-400">
              <Star className="mx-auto h-9 w-9" />
            </button>
          </div>
        </main>

        {/* ---------------- Bottom nav ---------------- */}
        <nav className="sticky bottom-0 border-t border-slate-700/80 bg-[#101c22]/80 backdrop-blur-sm">
          <div className="grid grid-cols-3 px-4 py-2">
            <Link
              to="/discover"
              className="flex flex-col items-center text-[#13a4ec]"
            >
              <Compass />
              <span className="text-xs">Discover</span>
            </Link>
            <Link
              to="/messages"
              className="flex flex-col items-center text-slate-400"
            >
              <MessageCircle />
              <span className="text-xs">Messages</span>
            </Link>
            <Link
              to="/profile"
              className="flex flex-col items-center text-slate-400"
            >
              <User />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
