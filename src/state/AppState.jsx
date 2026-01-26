// src/state/AppState.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";


const AppStateContext = createContext(null);

const DEFAULT_ME = {
  name: "Lyndon",
  age: "28",
  gender: "Male",
  location: "New York, NY",
  bio: "Looking for consistent training partners. Gym + runs. Down for weekends and early mornings.",
  photos: [
    "https://images.unsplash.com/photo-1520975958225-8f11f3c3d5b8?auto=format&fit=crop&w=900&q=80",
  ],
  interests: ["Gym", "Running", "Mobility"],
  skill: "Intermediate",
  availability: "Morning",
};

const DEFAULT_PREFS = {
  preferredActivities: ["Gym"],
  genderPref: "Any",
  ageMin: "18",
  ageMax: "35",
  radius: "10",
  availabilityFilterOn: false,
  availabilityPref: "Evening",

  // NEW (Discover filter)
  skillPref: "Any", // Any | Beginner | Intermediate | Advanced
};




function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function AppStateProvider({ children }) {
  const [me, setMe] = useState(() => load("fitfriends_me", DEFAULT_ME));
 const [prefs, setPrefs] = useState(() => {
  const loaded = load("fitfriends_prefs", DEFAULT_PREFS);
  return { ...DEFAULT_PREFS, ...(loaded ?? {}) };
});

  useEffect(() => save("fitfriends_me", me), [me]);
  useEffect(() => save("fitfriends_prefs", prefs), [prefs]);

  const value = useMemo(
    () => ({
      me,
      setMe,
      prefs,
      setPrefs,
      updateMe: (patch) => setMe((prev) => ({ ...prev, ...patch })),
      updatePrefs: (patch) => setPrefs((prev) => ({ ...prev, ...patch })),
      resetAll: () => {
        setMe(DEFAULT_ME);
        setPrefs(DEFAULT_PREFS);
      },
    }),
    [me, prefs]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
