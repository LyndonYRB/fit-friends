// src/state/AppState.jsx
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  STORAGE_KEYS,
  DEFAULT_ME,
  DEFAULT_PREFS,
  DEFAULT_MATCHES,
  DEFAULT_CONVERSATIONS,
  DEFAULT_BLOCKED,
  DEFAULT_REPORTS,
  load,
  save,
  uid,
  nowISO,
} from "./appStateCore";

/* =========================================================
   CONTEXT
========================================================= */

const AppStateContext = createContext(undefined);
AppStateContext.displayName = "AppStateContext";

/* =========================================================
   PROVIDER
========================================================= */

export function AppStateProvider({ children }) {
  /* -----------------------------
     STATE: ME
  ------------------------------ */
  const [me, setMe] = useState(() => load(STORAGE_KEYS.me, DEFAULT_ME));

  /* -----------------------------
     STATE: PREFS (merge defaults)
  ------------------------------ */
  const [prefs, setPrefs] = useState(() => {
    const loaded = load(STORAGE_KEYS.prefs, DEFAULT_PREFS);
    return { ...DEFAULT_PREFS, ...(loaded ?? {}) };
  });

  /* -----------------------------
     STATE: SOCIAL
  ------------------------------ */
  const [matches, setMatches] = useState(() =>
    load(STORAGE_KEYS.matches, DEFAULT_MATCHES)
  );

  const [conversations, setConversations] = useState(() =>
    load(STORAGE_KEYS.conversations, DEFAULT_CONVERSATIONS)
  );

  const [blockedUserIds, setBlockedUserIds] = useState(() =>
    load(STORAGE_KEYS.blocked, DEFAULT_BLOCKED)
  );

  const [reports, setReports] = useState(() =>
    load(STORAGE_KEYS.reports, DEFAULT_REPORTS)
  );

  /* -----------------------------
     PERSISTENCE
  ------------------------------ */
  useEffect(() => save(STORAGE_KEYS.me, me), [me]);
  useEffect(() => save(STORAGE_KEYS.prefs, prefs), [prefs]);
  useEffect(() => save(STORAGE_KEYS.matches, matches), [matches]);
  useEffect(() => save(STORAGE_KEYS.conversations, conversations), [conversations]);
  useEffect(() => save(STORAGE_KEYS.blocked, blockedUserIds), [blockedUserIds]);
  useEffect(() => save(STORAGE_KEYS.reports, reports), [reports]);

  /* =========================================================
     ACTIONS: PROFILE / PREFS
  ========================================================= */

  const updateMe = useCallback(
    (patch) => setMe((prev) => ({ ...prev, ...patch })),
    []
  );

  const updatePrefs = useCallback(
    (patch) => setPrefs((prev) => ({ ...prev, ...patch })),
    []
  );

  /* =========================================================
     HELPERS
  ========================================================= */

  // Handles mock users that store images as photos[0]
  const pickAvatar = useCallback((u) => {
    return (
      u?.avatar ||
      u?.photo ||
      (Array.isArray(u?.photos) ? u.photos[0] : null) ||
      u?.img ||
      null
    );
  }, []);

  /* =========================================================
     ACTIONS: CONNECT / MATCHES / MESSAGES
  ========================================================= */

  /**
   * CONNECT:
   * - Add to matches if missing
   * - Create conversation shell if missing
   * - local-first (no backend required yet)
   */
  const connectUser = useCallback(
    (targetUser) => {
      if (!targetUser?.id) return;
      if (blockedUserIds.includes(targetUser.id)) return;

      // Ensure match exists (or bump updatedAt if it already exists)
      setMatches((prev) => {
        const idx = prev.findIndex((m) => m.userId === targetUser.id);

        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], updatedAt: nowISO() };
          return next;
        }

        return [
          ...prev,
          {
            id: `m_${targetUser.id}`,
            userId: targetUser.id,
            name: targetUser.name || "Unknown",
            subtitle: targetUser.subtitle || targetUser.tagline || "",
            avatar: pickAvatar(targetUser),
            lastMessage: "Say hi 👋",
            unreadCount: 0,
            updatedAt: nowISO(),
          },
        ];
      });

      // Ensure conversation exists
      setConversations((prev) => {
        const exists = prev.some((c) => c.userId === targetUser.id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: `c_${targetUser.id}`,
            userId: targetUser.id,
            messages: [],
            createdAt: nowISO(),
            updatedAt: nowISO(),
          },
        ];
      });
    },
    [blockedUserIds, pickAvatar]
  );

  /**
   * SEND MESSAGE:
   * - Adds message to conversation
   * - Updates match preview (lastMessage + updatedAt)
   */
  const sendMessage = useCallback(
    ({ toUserId, text }) => {
      const clean = text?.trim();
      if (!toUserId || !clean) return;
      if (blockedUserIds.includes(toUserId)) return;

      const message = {
        id: uid("msg"),
        from: "me",
        text: clean,
        createdAt: nowISO(),
      };

      // Upsert conversation + append message
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.userId === toUserId);

        // Create convo if missing
        if (idx === -1) {
          return [
            ...prev,
            {
              id: `c_${toUserId}`,
              userId: toUserId,
              messages: [message],
              createdAt: nowISO(),
              updatedAt: nowISO(),
            },
          ];
        }

        const next = [...prev];
        const convo = next[idx];
        next[idx] = {
          ...convo,
          messages: [...(convo.messages || []), message],
          updatedAt: nowISO(),
        };
        return next;
      });

      // Update match preview
      setMatches((prev) => {
        const idx = prev.findIndex((m) => m.userId === toUserId);
        if (idx === -1) return prev;

        const next = [...prev];
        next[idx] = {
          ...next[idx],
          lastMessage: clean,
          updatedAt: nowISO(),
          // unreadCount: 0, // optional: keep as-is unless you implement "read"
        };
        return next;
      });
    },
    [blockedUserIds]
  );

  /* =========================================================
     ACTIONS: SAFETY (BLOCK / REPORT)
  ========================================================= */

  const blockUser = useCallback((targetUserId) => {
    if (!targetUserId) return;

    setBlockedUserIds((prev) => Array.from(new Set([...prev, targetUserId])));
    setMatches((prev) => prev.filter((m) => m.userId !== targetUserId));
    setConversations((prev) => prev.filter((c) => c.userId !== targetUserId));
  }, []);

  const reportUser = useCallback(({ targetUserId, reason, details = "" }) => {
    if (!targetUserId || !reason?.trim()) return;

    const entry = {
      id: uid("rpt"),
      targetUserId,
      reason: reason.trim(),
      details: details.trim(),
      createdAt: nowISO(),
    };

    setReports((prev) => [entry, ...prev]);
  }, []);

  const reportAndBlock = useCallback(
    ({ targetUserId, reason, details = "" }) => {
      reportUser({ targetUserId, reason, details });
      blockUser(targetUserId);
    },
    [reportUser, blockUser]
  );

  /* =========================================================
     RESET
  ========================================================= */

  const resetAll = useCallback(() => {
    setMe(DEFAULT_ME);
    setPrefs(DEFAULT_PREFS);
    setMatches(DEFAULT_MATCHES);
    setConversations(DEFAULT_CONVERSATIONS);
    setBlockedUserIds(DEFAULT_BLOCKED);
    setReports(DEFAULT_REPORTS);
  }, []);

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */

  const value = useMemo(
    () => ({
      me,
      prefs,
      matches,
      conversations,
      blockedUserIds,
      reports,

      updateMe,
      updatePrefs,

      connectUser,
      sendMessage,

      blockUser,
      reportUser,
      reportAndBlock,

      resetAll,
    }),
    [
      me,
      prefs,
      matches,
      conversations,
      blockedUserIds,
      reports,
      updateMe,
      updatePrefs,
      connectUser,
      sendMessage,
      blockUser,
      reportUser,
      reportAndBlock,
      resetAll,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (ctx === undefined) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
}
