// =======================================
// Your Profile Page
// src/pages/UserProfile.jsx
// =======================================

/* ---------- Imports ---------- */
import { useAppState } from "../state/AppState.jsx";
import { useEffect, useRef, useState } from "react";
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

const getPhotoSrc = (photo) => {
  if (typeof photo === "string") return photo;
  return photo?.src || photo?.url || "";
};

/* =======================================
   Component
======================================= */
export default function UserProfile() {
  /* ---------- Navigation & Global State ---------- */
  const navigate = useNavigate();
  const { me, updateMe, uploadProfilePhoto } = useAppState();

  /* ---------- Derived ---------- */
  const photoItems = Array.isArray(me?.photos) ? me.photos : [];
  const photos = photoItems.map(getPhotoSrc).filter(Boolean);
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
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
  const stopCamera = (stream = cameraStream) => {
    stream?.getTracks?.().forEach((track) => track.stop());
    setCameraStream(null);
  };

  useEffect(() => {
    if (cameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraOpen, cameraStream]);

  useEffect(() => {
    return () => {
      cameraStream?.getTracks?.().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  const startCamera = async () => {
    const openSlots = Math.max(0, 6 - photoItems.length);
    if (!openSlots) {
      setPhotoError("You can upload up to 6 profile photos.");
      setSheetOpen(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setPhotoError("This browser does not support in-app camera capture. Opening the file picker instead.");
      openCameraPicker();
      setSheetOpen(false);
      return;
    }

    setCameraStarting(true);
    setPhotoError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setCameraStream(stream);
      setCameraOpen(true);
      setSheetOpen(false);
    } catch (err) {
      console.error(err);
      const errorName = err?.name || "";
      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        setPhotoError("Camera permission was denied. You can still choose an image from your files.");
      } else if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
        setPhotoError("No camera was found on this device. You can still choose an image from your files.");
      } else {
        setPhotoError("Could not start the camera. You can still choose an image from your files.");
      }
    } finally {
      setCameraStarting(false);
    }
  };

  const cancelCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const captureCameraPhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 960;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    setPhotoUploading(true);
    setPhotoError("");

    try {
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (nextBlob) => {
            if (nextBlob) resolve(nextBlob);
            else reject(new Error("Could not capture camera image."));
          },
          "image/jpeg",
          0.9
        );
      });
      const file = new File([blob], `profile-photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const previewSrc = canvas.toDataURL("image/jpeg", 0.9);
      const uploaded = await uploadProfilePhoto(file, previewSrc);
      updateMe({ photos: [...photoItems, uploaded || previewSrc].slice(0, 6) });
      cancelCamera();
    } catch (err) {
      console.error(err);
      setPhotoError("Could not capture or upload the photo. Try again or choose an image.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const onPhotosSelected = async (e) => {
    const openSlots = Math.max(0, 6 - photoItems.length);
    const files = Array.from(e.target.files || []).slice(0, openSlots);
    if (!files.length) return;

    setPhotoUploading(true);
    setPhotoError("");

    try {
      const nextPhotos = [...photoItems];

      for (const file of files) {
        const previewSrc = await fileToDataUrl(file);

        try {
          const uploaded = await uploadProfilePhoto(file, previewSrc);
          nextPhotos.push(uploaded || previewSrc);
        } catch (uploadError) {
          console.error(uploadError);
          nextPhotos.push(previewSrc);
          setPhotoError("Could not upload one of the photos. Keeping the local preview.");
        }
      }

      updateMe({ photos: nextPhotos.slice(0, 6) });
    } catch (err) {
      console.error(err);
      setPhotoError("Could not read one of the photos. Try a different image.");
    } finally {
      setPhotoUploading(false);
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
            capture="user"
            hidden
            onChange={onPhotosSelected}
          />

          {photoError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {photoError}
            </div>
          ) : null}

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
                  disabled={photoUploading}
                  className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
                >
                  <ImagePlus className="h-5 w-5" />
                  Choose
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={photoUploading || cameraStarting}
                  className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
                >
                  <Camera className="h-5 w-5" />
                  {photoUploading || cameraStarting ? "Opening..." : "Take photo"}
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                If in-app camera is unavailable, your browser may fall back to the camera/file picker.
              </div>
            </div>
          </div>
        ) : null}

        {cameraOpen ? (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute left-0 right-0 top-1/2 mx-auto w-full max-w-[390px] -translate-y-1/2 px-4">
              <div className="rounded-3xl border border-white/10 bg-[#0f1b21] p-4">
                <div className="flex items-center justify-between pb-3">
                  <div className="text-sm font-bold text-white">Take a photo</div>
                  <button
                    type="button"
                    onClick={cancelCamera}
                    className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
                    aria-label="Cancel camera"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <canvas ref={canvasRef} hidden />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={cancelCamera}
                    disabled={photoUploading}
                    className="flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={captureCameraPhoto}
                    disabled={photoUploading}
                    className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#13a4ec] text-sm font-bold text-white hover:bg-[#13a4ec]/90"
                  >
                    <Camera className="h-5 w-5" />
                    {photoUploading ? "Uploading..." : "Capture"}
                  </button>
                </div>
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
