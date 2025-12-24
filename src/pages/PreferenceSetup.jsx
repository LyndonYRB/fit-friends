// src/pages/PreferenceSetup.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Users,
  Calendar,
  Clock,
  Check,
} from "lucide-react";

const activities = [
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

function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-[#13a4ec] text-white"
          : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function PreferenceSetup() {
  const navigate = useNavigate();

  // UI-only
  const [preferredActivities, setPreferredActivities] = useState(["Gym"]);
  const [genderPref, setGenderPref] = useState("Any");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("35");
  const [radius, setRadius] = useState("10"); // miles
  const [availabilityFilterOn, setAvailabilityFilterOn] = useState(false);
  const [availabilityPref, setAvailabilityPref] = useState("Evening");
  const [error, setError] = useState("");

  const toggleActivity = (label) => {
    setPreferredActivities((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const ageMinNum = useMemo(() => Number(ageMin), [ageMin]);
  const ageMaxNum = useMemo(() => Number(ageMax), [ageMax]);

  const onContinue = () => {
    setError("");

    if (!preferredActivities.length) return setError("Select at least one activity.");
    if (!ageMin.trim() || !ageMax.trim()) return setError("Enter an age range.");
    if (Number.isNaN(ageMinNum) || Number.isNaN(ageMaxNum))
      return setError("Age range must be numbers.");
    if (ageMinNum < 18) return setError("Minimum age must be 18 or older.");
    if (ageMinNum > ageMaxNum) return setError("Minimum age can't exceed maximum age.");
    if (!radius.trim() || Number(radius) < 1) return setError("Enter a valid distance.");

    // UI-only: proceed to discover
    navigate("/discover");
  };

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>

          <h1 className="text-lg font-bold text-white">Preferences</h1>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/5">
            <SlidersHorizontal className="h-5 w-5 text-white/80" />
          </div>
        </header>

        {error ? (
          <div className="mt-3 px-6">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        ) : null}

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-12 space-y-5">
          {/* Preferred Activities */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
              <MapPin className="h-4 w-4 text-white/40" />
              Preferred activities
            </div>

            <div className="flex flex-wrap gap-2">
              {activities.map((a) => (
                <Pill
                  key={a}
                  label={a}
                  active={preferredActivities.includes(a)}
                  onClick={() => toggleActivity(a)}
                />
              ))}
            </div>
          </section>

          {/* Age Range */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
              <Calendar className="h-4 w-4 text-white/40" />
              Age range
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  placeholder="Min"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] px-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  placeholder="Max"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] px-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>
          </section>

          {/* Gender preference */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
              <Users className="h-4 w-4 text-white/40" />
              Preferred gender
            </div>

            <div className="relative">
              <select
                value={genderPref}
                onChange={(e) => setGenderPref(e.target.value)}
                className="h-14 w-full appearance-none rounded-full border border-white/10 bg-[#101c22] pl-4 pr-12 text-base font-semibold text-white outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              >
                <option>Any</option>
                <option>Women</option>
                <option>Men</option>
                <option>Non-binary</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
          </section>

          {/* Distance radius */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
              <MapPin className="h-4 w-4 text-white/40" />
              Distance radius (miles)
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Within {radius} miles</div>
                <div className="text-xs font-semibold text-gray-400">1 – 25</div>
              </div>

              <input
                type="range"
                min="1"
                max="25"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="mt-4 w-full"
              />
            </div>
          </section>

          {/* Availability matching */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
                <Clock className="h-4 w-4 text-white/40" />
                Availability matching
              </div>

              <button
                type="button"
                onClick={() => setAvailabilityFilterOn((v) => !v)}
                className={[
                  "relative h-7 w-12 rounded-full border transition",
                  availabilityFilterOn
                    ? "border-[#13a4ec]/40 bg-[#13a4ec]/30"
                    : "border-white/10 bg-white/5",
                ].join(" ")}
                aria-label="Toggle availability filter"
              >
                <span
                  className={[
                    "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition",
                    availabilityFilterOn ? "left-6 bg-[#13a4ec]" : "left-1 bg-white/30",
                  ].join(" ")}
                />
              </button>
            </div>

            {availabilityFilterOn ? (
              <div className="relative">
                <select
                  value={availabilityPref}
                  onChange={(e) => setAvailabilityPref(e.target.value)}
                  className="h-14 w-full appearance-none rounded-full border border-white/10 bg-[#101c22] pl-4 pr-12 text-base font-semibold text-white outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Weekends only</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                Off — we won’t filter by availability.
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={onContinue}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
          >
            <Check className="h-5 w-5" />
            Continue
          </button>
        </footer>
      </div>
    </div>
  );
}
