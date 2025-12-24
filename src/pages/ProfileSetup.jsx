//Profile Setup
// src/pages/ProfileSetup.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  Star,
  Trophy,
  User,
  ImagePlus,
  Calendar,
  Users,
  Clock,
  FileText,
} from "lucide-react";

const interests = ["Gym", "Pilates", "Dance", "Running", "Soccer", "Basketball", "Volleyball", "Swimming", "Boxing"];

export default function ProfileSetup() {

const navigate = useNavigate();

const locationState = useLocation();
const existing = locationState.state?.me;

const [name, setName] = useState(existing?.name ?? "");
const [age, setAge] = useState(existing?.age?.toString() ?? "");
const [gender, setGender] = useState(existing?.gender ?? "Male");
const [location, setLocation] = useState(existing?.location ?? "");
const [skill, setSkill] = useState(existing?.skill ?? "Beginner");
const [availability, setAvailability] = useState(existing?.availability ?? "Evening");
const [bio, setBio] = useState(existing?.bio ?? "");
const [selectedInterests, setSelectedInterests] = useState(existing?.interests ?? ["Gym"]);
  const [error, setError] = useState("");

  const toggleInterest = (label) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const onSave = () => {
    console.log({ name, age, location, selectedInterests, bio });
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!age.trim() || Number(age) < 13) return setError("Please enter a valid age.");
    if (!location.trim()) return setError("Please enter your location.");
    if (!selectedInterests.length) return setError("Please select at least one interest.");
    if (bio.trim().length < 10) return setError("Bio should be at least 10 characters.");

    // UI-only
    navigate("/preference-setup");
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

          <h1 className="text-lg font-bold text-white">Profile Setup</h1>
          <div className="w-10" />
        </header>

        {error ? (
          <div className="mt-3 px-6">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        ) : null}

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-24 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Doe"
                className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              />
            </div>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 28"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Gender</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-14 w-full appearance-none rounded-full border border-white/10 bg-[#101c22] pl-12 pr-12 text-base font-semibold text-white outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">
              Location (GPS or manual)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY"
                className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Activity interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((label) => {
                const active = selectedInterests.includes(label);
                return (
                  <button
                    type="button"
                    key={label}
                    onClick={() => toggleInterest(label)}
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
              })}
            </div>
          </div>

          {/* Skill Level */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Skill Level</label>
            <div className="relative">
              <Star className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="h-14 w-full appearance-none rounded-full border border-white/10 bg-[#101c22] pl-12 pr-12 text-base font-semibold text-white outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Availability</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="h-14 w-full appearance-none rounded-full border border-white/10 bg-[#101c22] pl-12 pr-12 text-base font-semibold text-white outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              >
                <option>Morning</option>
                <option>Evening</option>
                <option>Weekends only</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Short bio</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people what you’re training for, what you like doing, etc."
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-[#101c22] pl-12 pr-4 pt-3 text-sm font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
              />
            </div>
          </div>

          {/* Photos (UI-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Profile photo(s)</label>
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
              onClick={() => alert("Hook up photo upload later")}
            >
              <ImagePlus className="h-5 w-5" />
              Add Photos
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={onSave}
            className="h-14 w-full rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
          >
            Save Profile
          </button>
        </footer>
      </div>
    </div>
  );
}
