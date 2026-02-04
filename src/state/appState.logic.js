// src/state/appState.logic.js

/* =========================================================
   STORAGE KEYS
========================================================= */
export const STORAGE_KEYS = {
  me: "fitfriends_me",
  prefs: "fitfriends_prefs",
  matches: "fitfriends_matches",
  conversations: "fitfriends_conversations",
  blocked: "fitfriends_blocked",
  reports: "fitfriends_reports",
};

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function nowISO() {
  return new Date().toISOString();
}
