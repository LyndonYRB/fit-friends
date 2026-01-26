// =======================================
// Your Profile Page
// src/pages/UserProfile.jsx
// =======================================

/* ---------- Imports ---------- */
import { useAppState } from "../state/AppState.jsx";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Trophy,
  Star,
  Clock,
  Pencil,
  Settings,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
} from "lucide-react";

/* ---------- UI Helpers ---------- */
const Chip = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <div className="text-white/60">{icon}</div>
    <div className="flex-1">
      <div className="text-xs font-semibold text-gray-400">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  </div>
);

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* =======================================
   Component
======================================= */
export default function UserProfile() {
  /* ---------- Navigation & Global State ---------- */
  const navigate = useNavigate();
  const { me, updateMe } = useAppState();

  /* ---------- Derived ---------- */
  const photos = me?.photos || [];
  const cover = photos[0] || "";
  const interests = me?.interests || [];
  const name = me?.name || "Your Name";
  const age = me?.age || "";
  const location = me?.location || "—";
  const bio =
    me?.bio || "Add a short bio so people know what you're training for.";

  /* ---------- Modals ---------- */
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ---------- Swipe handling ---------- */
  const touchStartX = useRef(null);
  const onTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
  };
  const onTouchEnd = (e) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    const end = e.changedTouches?.[0]?.clientX ?? null;
    if (start == null || end == null) return;

    const delta = end - start;
    if (Math.abs(delta) < 40) return;

    if (delta < 0) next();
    else prev();
  };

  const prev = () => {
    if (!photos.length) return;
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  const next = () => {
    if (!photos.length) return;
    setActiveIndex((i) => (i + 1) % photos.length);
  };

  /* ---------- Photo inputs for action sheet ---------- */
  const libraryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const openLibraryPicker = () => libraryInputRef.current?.click();
  const openCameraPicker = () => cameraInputRef.current?.click();

  const onPhotosSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl));
      const combined = [...photos, ...dataUrls].slice(0, 6);

      // IMPORTANT: safest update (prevents wiping other fields if updateMe replaces)
      updateMe({ ...me, photos: combined });
    } catch (err) {
      console.error(err);
    }

    e.target.value = "";
    setSheetOpen(false);
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate("/discover")}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>

          <h1 className="text-lg font-bold text-white">Your Profile</h1>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6 text-white" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-28 space-y-5">
          {/* Hidden inputs */}
          <input
            ref={libraryInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onPhotosSelected}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={onPhotosSelected}
          />

          {/* Cover Photo (tap to open carousel)
              NOTE: this is now a DIV (not a button) to avoid nested buttons
          */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveIndex(0);
              setCarouselOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveIndex(0);
                setCarouselOpen(true);
              }
            }}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 text-left"
            aria-label="Open photos"
          >
            <div className="aspect-[16/10] w-full">
              {cover ? (
                <img src={cover} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-white/10 to-transparent" />
              )}
            </div>

            {/* Camera button → action sheet */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSheetOpen(true);
              }}
              className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60"
              aria-label="Add or take photo"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>

            {/* Small count */}
            {photos.length ? (
              <div className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white">
                {photos.length}/6
              </div>
            ) : null}
          </div>

          {/* Name + Location */}
          <div className="space-y-1">
            <div className="text-4xl font-black text-white">
              {name}
              {age ? `, ${age}` : ""}
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-[#8fb4c8]">
              <MapPin className="h-5 w-5 text-white/50" />
              {location}
            </div>
          </div>

          {/* About */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-bold text-gray-400">About</div>
            <div className="mt-3 text-base font-semibold leading-7 text-white/90">
              {bio}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <div className="text-sm font-bold text-gray-400">Activity interests</div>
            <div className="flex flex-wrap gap-2">
              {interests.length ? (
                interests.map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white"
                  >
                    {x}
                  </span>
                ))
              ) : (
                <div className="text-xs text-gray-500">No interests selected yet.</div>
              )}
            </div>
          </div>

          {/* Detail Chips */}
          <div className="grid grid-cols-1 gap-3">
            <Chip
              icon={<Trophy className="h-5 w-5" />}
              label="Primary activity"
              value={interests[0] || "—"}
            />
            <Chip
              icon={<Star className="h-5 w-5" />}
              label="Skill level"
              value={me?.skill || "—"}
            />
            <Chip
              icon={<Clock className="h-5 w-5" />}
              label="Availability"
              value={me?.availability || "—"}
            />
          </div>

          {/* Edit */}
          <button
            type="button"
            onClick={() => navigate("/profile-setup")}
            className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
          >
            <Pencil className="h-5 w-5" />
            Edit Profile
          </button>
        </main>

        {/* ---------- Action Sheet (Choose / Take) ---------- */}
        {sheetOpen ? (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[390px] rounded-t-3xl border border-white/10 bg-[#0f1b21] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white">Add a photo</div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openLibraryPicker}
                  className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
                >
                  <ImagePlus className="h-5 w-5" />
                  Choose
                </button>
                <button
                  type="button"
                  onClick={openCameraPicker}
                  className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
                >
                  <Camera className="h-5 w-5" />
                  Take photo
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                On mobile, “Take photo” opens camera (browser/device dependent).
              </div>
            </div>
          </div>
        ) : null}

        {/* ---------- Carousel Modal (Swipe) ---------- */}
        {carouselOpen ? (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setCarouselOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute left-0 right-0 top-1/2 mx-auto w-full max-w-[390px] -translate-y-1/2 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-3xl border border-white/10 bg-[#0f1b21] p-3">
                <div className="flex items-center justify-between px-1 pb-2">
                  <div className="text-sm font-bold text-white">
                    Photos{" "}
                    {photos.length ? `${activeIndex + 1}/${photos.length}` : ""}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCarouselOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                <div
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="aspect-[4/5] w-full">
                    {photos.length ? (
                      <img
                        src={photos[activeIndex]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-b from-white/10 to-transparent" />
                    )}
                  </div>

                  {photos.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-black/40 hover:bg-black/60"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-black/40 hover:bg-black/60"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    </>
                  ) : null}

                  {photos.length > 1 ? (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      {photos.map((_, i) => (
                        <div
                          key={i}
                          className={[
                            "h-2 w-2 rounded-full",
                            i === activeIndex ? "bg-white" : "bg-white/30",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Swipe left/right to browse.
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
