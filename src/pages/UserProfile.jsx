//User Profile page
// src/pages/UserProfile.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Trophy,
  Star,
  Clock,
  Pencil,
  Settings,
  Camera,
} from "lucide-react";

const Chip = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-white/60">{icon}</div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-gray-400">{label}</div>
        <div className="text-sm font-bold text-white">{value}</div>
      </div>
    </div>
  );

export default function UserProfile() {
  const navigate = useNavigate();

  // UI-only mock data (replace with real user data later)
  const me = {
    name: "Lyndon",
    age: 28,
    location: "New York, NY",
    bio: "Looking for consistent training partners. Gym + runs. Down for weekends and early mornings.",
    photos: [
      "https://images.unsplash.com/photo-1520975958225-8f11f3c3d5b8?auto=format&fit=crop&w=900&q=80",
    ],
    interests: ["Gym", "Running", "Mobility"],
    skill: "Intermediate",
    availability: "Morning",
  };

  

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

          <h1 className="text-lg font-bold text-white">Your Profile</h1>

          <Link
            to="/settings"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6 text-white" />
          </Link>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-28 space-y-5">
          {/* Photo */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div
              className="h-[320px] w-full bg-cover bg-center"
              style={{ backgroundImage: `url("${me.photos[0]}")` }}
            />
            {/* Edit photo button (UI-only) */}
            <button
              type="button"
              onClick={() => alert("Hook up photo upload later")}
              className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/50"
              aria-label="Edit photos"
            >
              <Camera className="h-6 w-6" />
            </button>
          </div>

          {/* Name + meta */}
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              {me.name}, {me.age}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-slate-400">
              <MapPin className="h-5 w-5" />
              <span className="text-base">{me.location}</span>
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-gray-400">About</div>
            <p className="mt-2 text-sm leading-6 text-gray-300">{me.bio}</p>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-400">
              Activity interests
            </div>
            <div className="flex flex-wrap gap-2">
              {me.interests.map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <Chip
              icon={<Trophy className="h-5 w-5" />}
              label="Primary activity"
              value={me.interests[0]}
            />
            <Chip
              icon={<Star className="h-5 w-5" />}
              label="Skill level"
              value={me.skill}
            />
            <Chip
              icon={<Clock className="h-5 w-5" />}
              label="Availability"
              value={me.availability}
            />
          </div>

          {/* Edit Profile CTA */}
          <div className="pt-1">
            <Link
              to="/profile-setup"
              state={{ me }}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
            >
              <Pencil className="h-5 w-5" />
              Edit Profile
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
