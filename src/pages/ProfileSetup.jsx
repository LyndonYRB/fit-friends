// src/pages/ProfileSetup.jsx

// ======================
// Imports
// ======================
import { useAppState } from "../state/AppState";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  ImagePlus,
  MapPin,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


// ======================
// Constants
// ======================
const interests = [
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

const MAX_PHOTOS = 6;

// ======================
// Helpers
// ======================
// Convert a File -> local preview while the backend upload runs.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getPhotoSrc(photo) {
  if (typeof photo === "string") return photo;
  return photo?.src || photo?.url || "";
}

function normalizePhotoItem(photo) {
  if (typeof photo === "string") {
    return { id: crypto.randomUUID(), src: photo };
  }

  const src = getPhotoSrc(photo);
  return {
    ...photo,
    id: photo?.id || crypto.randomUUID(),
    src,
    url: photo?.url || src,
  };
}

/* Sortable photo item for DnD */

function SortablePhoto({ id, src, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "manipulation",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5",
        isDragging ? "opacity-80 ring-2 ring-[#13a4ec]/50" : "",
      ].join(" ")}
      {...attributes}
      {...listeners}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
        aria-label="Remove photo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}


export default function ProfileSetup() {
  // ======================
  // Hooks / State
  // ======================
  const navigate = useNavigate();
  const {
    me,
    saveProfile,
    refreshMe,
    authLoading,
    uploadProfilePhoto,
    deleteProfilePhoto,
    reorderProfilePhotos,
  } = useAppState();

  // Use AppState as the single source of truth for initial values
  const existing = useMemo(() => me ?? {}, [me]);

  const fileInputRef = useRef(null);
  const hydratedRef = useRef(false);

  const [name, setName] = useState(existing?.name ?? "");
  const [age, setAge] = useState(existing?.age?.toString() ?? "");
  const [gender, setGender] = useState(existing?.gender ?? "Male");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [skill, setSkill] = useState(existing?.skill ?? "Beginner");
  const [availability, setAvailability] = useState(existing?.availability ?? "Evening");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [selectedInterests, setSelectedInterests] = useState(existing?.interests ?? ["Gym"]);

  const [photos, setPhotos] = useState(
  Array.isArray(existing?.photos)
    ? existing.photos.map(normalizePhotoItem)
    : []
);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    if (!me || authLoading || hydratedRef.current) return;
    hydratedRef.current = true;

    setName(me?.name ?? "");
    setAge(me?.age?.toString() ?? "");
    setGender(me?.gender ?? "Male");
    setLocation(me?.location ?? "");
    setSkill(me?.skill ?? "Beginner");
    setAvailability(me?.availability ?? "Evening");
    setBio(me?.bio ?? "");
    setSelectedInterests(me?.interests ?? ["Gym"]);
    setPhotos(
      Array.isArray(me?.photos)
        ? me.photos.map(normalizePhotoItem)
        : []
    );
  }, [authLoading, me]);

  // ======================
  // Handlers
  // ======================
  const toggleInterest = (label) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const openPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  const onPhotosSelected = async (e) => {
    const openSlots = Math.max(0, MAX_PHOTOS - photos.length);
    const files = Array.from(e.target.files || []).slice(0, openSlots);
    if (!files.length) return;

    try {
      for (const file of files) {
        const previewSrc = await fileToDataUrl(file);
        const tempId = crypto.randomUUID();

        setPhotos((prev) =>
          [...prev, { id: tempId, src: previewSrc, uploading: true }].slice(0, MAX_PHOTOS)
        );

        try {
          const uploaded = await uploadProfilePhoto(file, previewSrc);
          setPhotos((prev) =>
            prev.map((photo) =>
              photo.id === tempId
                ? normalizePhotoItem({ ...uploaded, uploading: false })
                : photo
            )
          );
        } catch (uploadError) {
          console.error(uploadError);
          setPhotos((prev) =>
            prev.map((photo) =>
              photo.id === tempId
                ? { ...photo, uploading: false, uploadError: true }
                : photo
            )
          );
          setError("Could not upload one of the images. Keeping the local preview.");
        }
      }

      // Reset input so selecting the same file again still triggers onChange
      e.target.value = "";
    } catch (err) {
      console.error(err);
      setError("Could not read one of the images. Try a different file.");
    }
  };

  const removePhoto = async (id) => {
  const photo = photos.find((p) => p.id === id);
  const nextPhotos = photos.filter((p) => p.id !== id);
  setPhotos(nextPhotos);

  try {
    await deleteProfilePhoto(photo);
    await reorderProfilePhotos(nextPhotos);
  } catch (err) {
    console.error(err);
    setError("Could not sync photo removal. The local photo list was updated.");
  }
};


  const onSave = async () => {
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!age.trim() || Number(age) < 13) return setError("Please enter a valid age.");
    if (!location.trim()) return setError("Please enter your location.");
    if (!selectedInterests.length) return setError("Please select at least one interest.");
    if (bio.trim().length < 10) return setError("Bio should be at least 10 characters.");

    try {
      setSaving(true);
      await saveProfile({
      name,
      age,
      gender,
      location,
      skill,
      availability,
      bio,
      interests: selectedInterests,
      photos: photos.map(normalizePhotoItem).filter((p) => p.src), 
      });

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Could not save your profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

    // ======================
  // DnD Sensors + Drag End
  // ======================
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = async (event) => {
  const { active, over } = event;
  if (!over) return;
  if (active.id === over.id) return;

  const oldIndex = photos.findIndex((p) => p.id === active.id);
  const newIndex = photos.findIndex((p) => p.id === over.id);
  if (oldIndex === -1 || newIndex === -1) return;

  const nextPhotos = arrayMove(photos, oldIndex, newIndex);
  setPhotos(nextPhotos);

  try {
    await reorderProfilePhotos(nextPhotos);
  } catch (err) {
    console.error(err);
    setError("Could not sync photo order. The local order was updated.");
  }
};



  // ======================
  // Render
  // ======================
  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
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

          <div className="space-y-3">
  <label className="text-sm font-medium text-gray-400">Profile photo(s)</label>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    capture="user"
    multiple
    hidden
    onChange={onPhotosSelected}
  />

  <button
    type="button"
    onClick={openPhotoPicker}
    className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10"
  >
    <ImagePlus className="h-5 w-5" />
    Add Photos
  </button>

  {photos.length > 0 && (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={onDragEnd}
  >
    <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((p) => (
          <SortablePhoto
            key={p.id}
            id={p.id}
            src={p.src}
            onRemove={() => removePhoto(p.id)}
          />
        ))}
      </div>
    </SortableContext>
  </DndContext>
)}

</div>

        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={onSave}
            disabled={saving || authLoading}
            className="h-14 w-full rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </footer>
      </div>
    </div>
  );
}
