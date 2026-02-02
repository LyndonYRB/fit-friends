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
/* NOTE:
   - activity must match ACTIVITIES exactly
   - skill must be Beginner/Intermediate/Advanced
   - miles is number used by Distance filter
*/
const cards = [
  {
    name: "Alex, 28",
    subtitle: "Intermediate Runner",
    distance: "5km away",
    activity: "Running",
    skill: "Intermediate",
    miles: 3,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
  },
  {
    name: "Sophia, 25",
    subtitle: "Advanced Dancer",
    distance: "10km away",
    activity: "Dance",
    skill: "Advanced",
    miles: 9,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY91asyYLfhpDr89J9P6ljRB0YcE4tCuPcWKfM6HEHfli9RvDI2rQcjWSIAcve5-HSbCLDRLyrvYkK3CpHjT5Fga2cq0VnV3G1HHTYkrvl-icx4FRI1uqZpGNQt-ApWcu_-TP6Q_AakgIPI6a3K6uHl_PO44BBWPAxVySzTI2luHuouWViAqDzAehUQijojKvK7b5OgABOu3rbi1J2WRKKGS--PyrI8ho3RBaxRQTqxBSnnG-CeTCU5sX6A4_Twn2nHApD0DJEn6u",
  },
  {
    name: "Ethan, 31",
    subtitle: "Beginner Weightlifter",
    distance: "2km away",
    activity: "Gym",
    skill: "Beginner",
    miles: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4TjRKEhM45QPM48QMXjVwYvZslZ3HZUzRj4oRA0YEPDus4p2JKc1r2FBPTYRla_DXKk-YnFLDE0W1ZUPtZoPDVB7Z5MY1OgZQH1SAsv4gZTZdIRAU0dBX0vK1hVRY-a4cVX1WNT_pQdUsHSfJgwMMH_iWQBPbJdM_KSFkn9SgNRtTBPZxVO86Ndb-VJSINTMNASZX0uQaiVWrgdv6gMQzmEE6ar0HsISmwYKK2m2Wsu3FvXfN4VDfvVTqKzOiC_dLhXOq5N7LTFe",
  },
  {
    name: "Maya, 27",
    subtitle: "Beginner Pilates",
    distance: "3km away",
    activity: "Pilates",
    skill: "Beginner",
    miles: 4,
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Jordan, 29",
    subtitle: "Intermediate Gym",
    distance: "7km away",
    activity: "Gym",
    skill: "Intermediate",
    miles: 7,
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kai, 24",
    subtitle: "Advanced Boxing",
    distance: "12km away",
    activity: "Boxing",
    skill: "Advanced",
    miles: 12,
    img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Nina, 32",
    subtitle: "Intermediate Swimming",
    distance: "1km away",
    activity: "Swimming",
    skill: "Intermediate",
    miles: 1,
    img: "https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b1b?auto=format&fit=crop&w=900&q=80",
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

  /* Swipe state */
  const SWIPE_X_THRESHOLD = 120;
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [swipeOut, setSwipeOut] = useState(null); // "left" | "right" | "up" | null

  /* Close dropdown on outside click */
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      const root = filterRef.current;
      if (root && root.contains(e.target)) return;
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

  /* Filtering (real) */
  const selectedActivities =
    preferredActivities && preferredActivities.length
      ? preferredActivities
      : ACTIVITIES;

  const filteredResults = useMemo(() => {
    return cards.filter((c) => {
      const activityOk = selectedActivities.includes(c.activity);
      const skillOk = skillPref === "Any" || c.skill === skillPref;
      const distanceOk = Number(c.miles) <= Number(radius);
      return activityOk && skillOk && distanceOk;
    });
  }, [selectedActivities, skillPref, radius]);

  /* Deck state = filteredResults (so swipe can remove cards) */
  const [deck, setDeck] = useState(filteredResults);

  useEffect(() => {
    setDeck(filteredResults);
    setDrag({ x: 0, y: 0, active: false });
    setSwipeOut(null);
  }, [filteredResults]);

  const topCard = deck.length ? deck[0] : null;

  const commitSwipe = (dir) => {
    if (!deck.length) return;
    setSwipeOut(dir);

    // let the CSS transition play, then remove the card
    window.setTimeout(() => {
      setDeck((prev) => prev.slice(1));
      setSwipeOut(null);
      setDrag({ x: 0, y: 0, active: false });
    }, 220);
  };

  const onPointerDownTop = (e) => {
    if (!topCard) return;
    // don’t allow swipe while dropdown is open
    if (open) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: 0, y: 0, active: true, startX: e.clientX, startY: e.clientY });
  };

  const onPointerMoveTop = (e) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setDrag((prev) => ({ ...prev, x: dx, y: dy }));
  };

  const onPointerUpTop = () => {
    if (!drag.active) return;

    // decide swipe
    if (drag.x > SWIPE_X_THRESHOLD) {
      commitSwipe("right");
      return;
    }
    if (drag.x < -SWIPE_X_THRESHOLD) {
      commitSwipe("left");
      return;
    }

    // snap back
    setDrag({ x: 0, y: 0, active: false });
  };

  /* Stack look (like your screenshot) */
  const stack = deck.slice(0, 3);

  const baseRot = [1, -2, 3];
  const baseY = [0, 6, 12];
  const baseScale = [1, 0.98, 0.96];

  const topTransform = () => {
    // swipe-out animation transform
    if (swipeOut === "right") return `translate3d(520px, ${drag.y}px, 0) rotate(18deg)`;
    if (swipeOut === "left") return `translate3d(-520px, ${drag.y}px, 0) rotate(-18deg)`;
    if (swipeOut === "up") return `translate3d(${drag.x}px, -520px, 0) rotate(0deg)`;

    // drag transform
    const rot = drag.x * 0.07; // feels good
    return `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${rot}deg)`;
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

            {/* Dropdown panel */}
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
                          type="button"
                          onClick={() => toggleSport(a)}
                          className={[
                            "rounded-full px-4 py-2 text-sm font-semibold transition",
                            preferredActivities.includes(a)
                              ? "bg-[#13a4ec] text-white"
                              : "bg-white/5 text-gray-200 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {a}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpen(null)}
                        className="rounded-full bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* SKILL */}
                {open === "skill" && (
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-white">
                      Skill Level
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {SKILLS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            updatePrefs({ skillPref: s });
                            setOpen(null);
                          }}
                          className={[
                            "h-12 rounded-xl font-bold transition",
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
              </div>
            )}
          </div>
        </header>

        {/* ---------------- Main ---------------- */}
        <main className="flex-1 px-6 pt-4 pb-24">
          <div className="relative h-[60vh]">
            {deck.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-lg font-extrabold text-white">
                  No matches
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  Try widening distance, changing skill level, or picking
                  different sports.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updatePrefs({
                      preferredActivities: ["Gym"],
                      skillPref: "Any",
                      radius: "10",
                    });
                    setOpen(null);
                  }}
                  className="mt-5 rounded-full bg-[#13a4ec] px-5 py-3 text-sm font-extrabold text-white hover:opacity-90"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              stack
                .map((c, i) => {
                  const isTop = i === 0;

                  const zIndex = 30 - i * 10;
                  const translateY = baseY[i] || 0;
                  const scale = baseScale[i] || 1;
                  const rot = baseRot[i] || 0;

                  const transform = isTop
                    ? topTransform()
                    : `translate3d(0px, ${translateY}px, 0) rotate(${rot}deg) scale(${scale})`;

                  const transition = isTop
                    ? drag.active
                      ? "none"
                      : "transform 220ms ease"
                    : "transform 220ms ease";

                  return (
                    <div
                      key={c.name}
                      onClick={() => {
                        if (!isTop) return;
                        navigate("/profile-view");
                      }}
                      onPointerDown={isTop ? onPointerDownTop : undefined}
                      onPointerMove={isTop ? onPointerMoveTop : undefined}
                      onPointerUp={isTop ? onPointerUpTop : undefined}
                      onPointerCancel={isTop ? onPointerUpTop : undefined}
                      className={[
                        "absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-slate-800 shadow-lg"
,
                        isTop ? "cursor-grab active:cursor-grabbing touch-none" : "",
                        isTop && c.hover
                          ? "transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:rotate-1"
                          : "",
                      ].join(" ")}
                      style={{
                        zIndex,
                        transform,
                        transition,
                      }}
                    >
                     {/* TOP IMAGE */}
                  <div className="relative h-3/5 w-full overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-full w-full object-cover object-center"
                    draggable={false}
                  />
                  {/* subtle vignette like your screenshot */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                  </div>

                  {/* BOTTOM INFO PANEL */}
                  <div className="flex flex-1 flex-col justify-between bg-[#1b2b3a] p-5">
                  <div>
                    <h2 className="text-4xl font-extrabold text-white leading-none">
                      {c.name}
                    </h2>
                    <p className="mt-2 text-lg font-semibold text-slate-400">{c.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{c.distance}</span>
                  </div>
                  </div>

                    </div>
                  );
                })
                // render bottom first, top last
                .reverse()
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-6">
            <button
              type="button"
              onClick={() => commitSwipe("left")}
              className="h-16 w-16 rounded-full bg-slate-700 text-red-400"
              aria-label="Pass"
              disabled={!deck.length}
            >
              <X className="mx-auto h-9 w-9" />
            </button>

            <button
              type="button"
              onClick={() => commitSwipe("right")}
              className="h-20 w-20 rounded-full bg-[#13a4ec] text-white"
              aria-label="Like"
              disabled={!deck.length}
            >
              <Heart className="mx-auto h-10 w-10 fill-white" />
            </button>

            <button
              type="button"
              onClick={() => commitSwipe("up")}
              className="h-16 w-16 rounded-full bg-slate-700 text-yellow-400"
              aria-label="Super like"
              disabled={!deck.length}
            >
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
              <Compass className="h-6 w-6" />
              <span className="text-xs">Discover</span>
            </Link>

            <Link
              to="/messages"
              className="flex flex-col items-center text-slate-400"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs">Messages</span>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center text-slate-400"
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
