//Settings page
// src/pages/Settings.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Bell,
  Eye,
  Moon,
  LogOut,
} from "lucide-react";
import { useAppState } from "../state/AppState.jsx";

const getPhotoSrc = (photo) => {
  if (typeof photo === "string") return photo;
  return photo?.src || photo?.url || "";
};

export default function Settings() {
  const navigate = useNavigate();
  const { authUser, logout, me } = useAppState();
  const [darkMode, setDarkMode] = useState(true);
  const fallbackAvatar =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlIypLNEHjhnguGqoMinVScvBaOgub9o9C4DcePlneS6qve8Y8GWgxoreBjO3eFeQpsaXuqzZA8wj9oe40z0bKrylPuKu88w13KD-H7EbHWwijO5tB7pi8P3dwHMIbNTMlo7MZI40hCtpnSu8SwIyyXEH5RxsN4LqVnEVvgM2-GCoLX6k4_g0BeYZ24y1PNdvJm9kwbyxbq9-T3_oXG6-BqKV71Fpmq5iE1Iw8xrkGHUPTmPGuYIzK3k7Qnp7hgMNXbX6Wo-LqpOGP";
  const profilePhoto = Array.isArray(me?.photos) ? getPhotoSrc(me.photos[0]) : null;
  const displayName = me?.name || authUser?.profile?.name || "Your Profile";
  const displayEmail = authUser?.email || me?.email || "";

  // Optional: if you want the toggle to actually control the "dark" class
  // (works if you're using the class strategy)
  const applyDarkClass = (enabled) => {
    const root = document.documentElement;
    if (enabled) root.classList.add("dark");
    else root.classList.remove("dark");
  };

  const onToggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      applyDarkClass(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header (sticky) */}
        <header className="sticky top-0 z-10 bg-[#101c22]/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            <h1 className="text-lg font-bold text-white">Settings</h1>
            <div className="w-6" />
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="space-y-8">
            {/* Profile header */}
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("${profilePhoto || fallbackAvatar}")`,
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-white">{displayName}</h2>
                <p className="text-sm text-gray-400">{displayEmail}</p>
              </div>
            </div>

            {/* Account section */}
            <section className="space-y-4">
              <h3 className="px-2 text-md font-semibold text-gray-300">
                Account
              </h3>

              <div className="overflow-hidden rounded-2xl bg-white/5 shadow-sm ring-1 ring-white/10">
                <Link
                  to="/edit-profile"
                  className="flex items-center justify-between border-b border-white/10 p-4"
                >
                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-200">Edit Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>

                <Link
                  to="/change-password"
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-200">Change Password</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>
              </div>
            </section>

            {/* Preferences section */}
            <section className="space-y-4">
              <h3 className="px-2 text-md font-semibold text-gray-300">
                Preferences
              </h3>

              <div className="overflow-hidden rounded-2xl bg-white/5 shadow-sm ring-1 ring-white/10">
                <Link
                  to="/notifications"
                  className="flex items-center justify-between border-b border-white/10 p-4"
                >
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-200">Notifications</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>

                <Link
                  to="/privacy"
                  className="flex items-center justify-between border-b border-white/10 p-4"
                >
                  <div className="flex items-center gap-4">
                    <Eye className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-200">Privacy</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Moon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-200">Dark Mode</span>
                  </div>

                  {/* Toggle (styled like Stitch) */}
                  <button
                    onClick={onToggleDark}
                    className={[
                      "relative inline-flex h-6 w-11 items-center rounded-full transition",
                      darkMode ? "bg-[#13a4ec]" : "bg-gray-700",
                    ].join(" ")}
                    role="switch"
                    aria-checked={darkMode}
                  >
                    <span
                      className={[
                        "inline-block h-5 w-5 transform rounded-full bg-white transition",
                        darkMode ? "translate-x-5" : "translate-x-1",
                      ].join(" ")}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Log out */}
            <section className="space-y-4">
              <div className="overflow-hidden rounded-2xl bg-white/5 shadow-sm ring-1 ring-white/10">
                <button
                  className="flex w-full items-center justify-center gap-3 p-4 text-red-400"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-semibold">Log Out</span>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
