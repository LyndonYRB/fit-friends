/* =========================================================
   appStateCore.js
   - Non-React exports ONLY (constants + pure helpers)
========================================================= */

export const STORAGE_KEYS = {
  me: "fitfriends_me",
  prefs: "fitfriends_prefs",
  matches: "fitfriends_matches",
  conversations: "fitfriends_conversations",
  blocked: "fitfriends_blocked",
  reports: "fitfriends_reports",
};

export const DEFAULT_ME = {
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

export const DEFAULT_PREFS = {
  preferredActivities: ["Gym"],
  genderPref: "Any",
  ageMin: "18",
  ageMax: "35",
  radius: "10",
  availabilityFilterOn: false,
  availabilityPref: "Evening",
  skillPref: "Any",
};

export const DEFAULT_MATCHES = [];
export const DEFAULT_CONVERSATIONS = [];
export const DEFAULT_BLOCKED = [];
export const DEFAULT_REPORTS = [];

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function nowISO() {
  return new Date().toISOString();
}
