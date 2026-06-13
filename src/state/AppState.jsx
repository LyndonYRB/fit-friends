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
import { api, clearAccessToken, getAccessToken, setAccessToken } from "../lib/api";

/* =========================================================
   CONTEXT
========================================================= */

const AppStateContext = createContext(undefined);
AppStateContext.displayName = "AppStateContext";

const TITLE_BY_VALUE = {
  gym: "Gym",
  pilates: "Pilates",
  dance: "Dance",
  running: "Running",
  soccer: "Soccer",
  basketball: "Basketball",
  volleyball: "Volleyball",
  swimming: "Swimming",
  boxing: "Boxing",
  strength: "Gym",
  mobility: "Mobility",
  male: "Male",
  female: "Female",
  "non-binary": "Non-binary",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  morning: "Morning",
  evening: "Evening",
  weekends: "Weekends only",
  "weekends only": "Weekends only",
  any: "Any",
  women: "Women",
  men: "Men",
};

function toApiValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace("weekends_only", "weekends");
}

function toUiValue(value) {
  const clean = String(value || "").trim().toLowerCase().replace(/_/g, " ");
  return TITLE_BY_VALUE[clean] || TITLE_BY_VALUE[clean.replace(/\s+/g, "-")] || value || "";
}

function toUiArray(values) {
  return Array.isArray(values) ? values.map(toUiValue).filter(Boolean) : [];
}

function normalizeProfile(profile, fallback = DEFAULT_ME) {
  if (!profile) return fallback;
  const availability = Array.isArray(profile.availability)
    ? profile.availability[0]
    : profile.availability;

  return {
    ...fallback,
    ...profile,
    age: profile.age == null ? "" : String(profile.age),
    gender: toUiValue(profile.gender),
    skill: toUiValue(profile.skill),
    availability: toUiValue(availability),
    interests: toUiArray(profile.interests),
  };
}

function normalizePreferences(preferences, fallback = DEFAULT_PREFS) {
  if (!preferences) return fallback;
  const availabilityPref = Array.isArray(preferences.availabilityPref)
    ? preferences.availabilityPref[0]
    : preferences.availabilityPref;

  return {
    ...fallback,
    ...preferences,
    preferredActivities: toUiArray(preferences.preferredActivities),
    genderPref: toUiValue(preferences.genderPref),
    ageMin: preferences.ageMin == null ? fallback.ageMin : String(preferences.ageMin),
    ageMax: preferences.ageMax == null ? fallback.ageMax : String(preferences.ageMax),
    radius: preferences.radius == null ? fallback.radius : String(preferences.radius),
    availabilityPref: toUiValue(availabilityPref) || fallback.availabilityPref,
    skillPref: toUiValue(preferences.skillPref),
  };
}

function profileToApi(profile) {
  return {
    name: profile.name,
    age: Number(profile.age),
    gender: toApiValue(profile.gender),
    location: profile.location,
    skill: toApiValue(profile.skill),
    availability: profile.availability ? [toApiValue(profile.availability)] : [],
    bio: profile.bio,
    interests: (profile.interests || []).map(toApiValue),
  };
}

function preferencesToApi(preferences) {
  return {
    preferredActivities: (preferences.preferredActivities || []).map(toApiValue),
    genderPref: toApiValue(preferences.genderPref),
    ageMin: Number(preferences.ageMin),
    ageMax: Number(preferences.ageMax),
    radius: Number(preferences.radius),
    availabilityFilterOn: Boolean(preferences.availabilityFilterOn),
    availabilityPref: preferences.availabilityPref
      ? [toApiValue(preferences.availabilityPref)]
      : [],
    skillPref: toApiValue(preferences.skillPref),
  };
}

function normalizePublicUser(user) {
  const interests = Array.isArray(user?.interests) ? user.interests : [];
  const availability = Array.isArray(user?.availability)
    ? user.availability.map(toUiValue).join(", ")
    : toUiValue(user?.availability);

  return {
    ...user,
    name: user?.name || "Athlete",
    subtitle: user?.subtitle || "Training Partner",
    avatar: Array.isArray(user?.photos) ? user.photos[0] : user?.avatar,
    photos: Array.isArray(user?.photos) ? user.photos : [],
    interests: interests.map(toUiValue),
    skill: toUiValue(user?.skill),
    availability,
  };
}

function messageFromBackend(message, currentUserId) {
  return {
    id: message.id,
    from: message.fromUserId === currentUserId ? "me" : message.fromUserId,
    fromUserId: message.fromUserId,
    toUserId: message.toUserId,
    text: message.text,
    createdAt: message.createdAt,
  };
}

function getPhotoSrc(photo) {
  if (typeof photo === "string") return photo;
  return photo?.src || photo?.url || "";
}

function getPhotoId(photo) {
  if (!photo || typeof photo === "string") return "";
  return photo.id || "";
}

function normalizePhoto(photo, fallbackSrc = "") {
  if (typeof photo === "string") {
    return { id: uid("photo"), src: photo };
  }

  const src = getPhotoSrc(photo) || fallbackSrc;
  return {
    ...photo,
    id: photo?.id || uid("photo"),
    src,
    url: photo?.url || src,
  };
}

/* =========================================================
   PROVIDER
========================================================= */

export function AppStateProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(() => Boolean(getAccessToken()));
  const [authError, setAuthError] = useState("");

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

  const [socialLoading, setSocialLoading] = useState(false);
  const [socialError, setSocialError] = useState("");

  /* -----------------------------
     PERSISTENCE
  ------------------------------ */
  useEffect(() => save(STORAGE_KEYS.me, me), [me]);
  useEffect(() => save(STORAGE_KEYS.prefs, prefs), [prefs]);
  useEffect(() => save(STORAGE_KEYS.matches, matches), [matches]);
  useEffect(() => save(STORAGE_KEYS.conversations, conversations), [conversations]);
  useEffect(() => save(STORAGE_KEYS.blocked, blockedUserIds), [blockedUserIds]);
  useEffect(() => save(STORAGE_KEYS.reports, reports), [reports]);

  const loadBackendState = useCallback(async () => {
    if (!getAccessToken()) {
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const [meResult, profileResult, prefsResult] = await Promise.all([
        api.me(),
        api.getProfile(),
        api.getPreferences(),
      ]);

      setAuthUser(meResult.user);
      setMe((prev) =>
        normalizeProfile(profileResult.profile, {
          ...prev,
          id: meResult.user?.id,
          email: meResult.user?.email,
          phone: meResult.user?.phone,
        })
      );
      setPrefs((prev) => normalizePreferences(prefsResult.preferences, prev));
    } catch (error) {
      clearAccessToken();
      setAuthUser(null);
      setAuthError(error.message || "Could not load your account.");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendState();
  }, [loadBackendState]);

  const loadConnections = useCallback(async () => {
    if (!getAccessToken()) return;

    setSocialLoading(true);
    setSocialError("");

    try {
      const result = await api.getConnections();
      const nextMatches = (Array.isArray(result) ? result : []).map((connection) => {
        const user = normalizePublicUser(connection.user);
        return {
          id: connection.connectionId || `m_${user.id}`,
          userId: user.id,
          name: user.name,
          subtitle: user.subtitle,
          avatar: user.avatar,
          lastMessage: "Say hi 👋",
          unreadCount: 0,
          updatedAt: connection.updatedAt || nowISO(),
        };
      });

      setMatches(nextMatches);
    } catch (error) {
      setSocialError(error.message || "Could not load connections.");
    } finally {
      setSocialLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    if (!getAccessToken()) return;

    setSocialLoading(true);
    setSocialError("");

    try {
      const result = await api.getConversations();
      const rows = Array.isArray(result) ? result : [];

      setMatches((prev) => {
        const existingByUserId = new Map((prev || []).map((m) => [m.userId, m]));

        return rows.map((row) => {
          const user = normalizePublicUser(row.user);
          const existing = existingByUserId.get(row.userId);
          return {
            id: existing?.id || `m_${row.userId}`,
            userId: row.userId,
            name: user.name,
            subtitle: user.subtitle,
            avatar: user.avatar,
            lastMessage: row.lastMessage?.text || existing?.lastMessage || "Say hi 👋",
            unreadCount: existing?.unreadCount || 0,
            updatedAt: row.updatedAt || row.lastMessage?.createdAt || existing?.updatedAt || nowISO(),
          };
        });
      });

      setConversations((prev) => {
        const existingByUserId = new Map((prev || []).map((c) => [c.userId, c]));

        return rows.map((row) => {
          const existing = existingByUserId.get(row.userId);
          return {
            id: row.id || existing?.id || `c_${row.userId}`,
            userId: row.userId,
            messages: existing?.messages || [],
            createdAt: existing?.createdAt || row.updatedAt || nowISO(),
            updatedAt: row.updatedAt || existing?.updatedAt || nowISO(),
          };
        });
      });
    } catch (error) {
      setSocialError(error.message || "Could not load conversations.");
    } finally {
      setSocialLoading(false);
    }
  }, []);

  const hideUserLocally = useCallback((targetUserId) => {
    if (!targetUserId) return;

    setBlockedUserIds((prev) => Array.from(new Set([...prev, targetUserId])));
    setMatches((prev) => prev.filter((m) => m.userId !== targetUserId));
    setConversations((prev) => prev.filter((c) => c.userId !== targetUserId));
  }, []);

  const loadConversationMessages = useCallback(
    async (userId) => {
      if (!getAccessToken() || !userId) return;

      setSocialLoading(true);
      setSocialError("");

      try {
        const result = await api.getMessages(userId);
        const messages = (Array.isArray(result) ? result : []).map((message) =>
          messageFromBackend(message, authUser?.id)
        );

        setConversations((prev) => {
          const idx = (prev || []).findIndex((c) => c.userId === userId);
          const nextConvo = {
            id: idx !== -1 ? prev[idx].id : `c_${userId}`,
            userId,
            messages,
            createdAt: idx !== -1 ? prev[idx].createdAt : nowISO(),
            updatedAt: messages.at(-1)?.createdAt || nowISO(),
          };

          if (idx === -1) return [...(prev || []), nextConvo];

          const next = [...prev];
          next[idx] = nextConvo;
          return next;
        });
      } catch (error) {
        if (error.status === 403) {
          hideUserLocally(userId);
        }
        setSocialError(error.message || "Could not load messages.");
      } finally {
        setSocialLoading(false);
      }
    },
    [authUser?.id, hideUserLocally]
  );

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

  const login = useCallback(
    async ({ email, password }) => {
      setAuthError("");
      const result = await api.login({ email, password });
      setAccessToken(result.accessToken);
      setAuthUser(result.user);
      await loadBackendState();
      return result;
    },
    [loadBackendState]
  );

  const register = useCallback(
    async ({ email, phone, password }) => {
      setAuthError("");
      const result = await api.register({ email, phone, password });
      setAccessToken(result.accessToken);
      setAuthUser(result.user);
      await loadBackendState();
      return result;
    },
    [loadBackendState]
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setAuthUser(null);
    setAuthError("");
    setMe(DEFAULT_ME);
    setPrefs(DEFAULT_PREFS);
  }, []);

  const saveProfile = useCallback(async (profile) => {
    const localProfile = {
      ...profile,
      age: String(profile.age),
    };

    setMe((prev) => ({ ...prev, ...localProfile }));

    if (!getAccessToken()) return { profile: localProfile };

    const result = await api.saveProfile(profileToApi(localProfile));
    const normalized = normalizeProfile(result.profile, localProfile);
    setMe((prev) => ({ ...prev, ...normalized }));
    return result;
  }, []);

  const savePreferences = useCallback(async (nextPrefs) => {
    setPrefs((prev) => ({ ...prev, ...nextPrefs }));

    if (!getAccessToken()) return { preferences: nextPrefs };

    const result = await api.savePreferences(preferencesToApi(nextPrefs));
    setPrefs((prev) => normalizePreferences(result.preferences, prev));
    return result;
  }, []);

  const uploadProfilePhoto = useCallback(async (file, previewSrc = "") => {
    if (!file) return null;

    if (!getAccessToken()) {
      const localPhoto = normalizePhoto(previewSrc || "");
      setMe((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), localPhoto].slice(0, 6),
      }));
      return localPhoto;
    }

    const result = await api.uploadPhoto(file);
    const uploadedPhoto = normalizePhoto(result, previewSrc);

    setMe((prev) => {
      const photos = [...(prev.photos || []), uploadedPhoto].slice(0, 6);
      return { ...prev, photos };
    });

    return uploadedPhoto;
  }, []);

  const deleteProfilePhoto = useCallback(async (photo) => {
    const photoId = getPhotoId(photo);
    const photoSrc = getPhotoSrc(photo);

    setMe((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((item) => {
        const itemId = getPhotoId(item);
        const itemSrc = getPhotoSrc(item);
        return photoId ? itemId !== photoId : itemSrc !== photoSrc;
      }),
    }));

    if (photoId && getAccessToken()) {
      await api.deletePhoto(photoId);
    }
  }, []);

  const reorderProfilePhotos = useCallback(async (photos) => {
    const normalizedPhotos = (photos || []).map((photo) => normalizePhoto(photo));

    setMe((prev) => ({
      ...prev,
      photos: normalizedPhotos,
    }));

    const backendPhotoIds = normalizedPhotos.map(getPhotoId).filter(Boolean);
    if (backendPhotoIds.length && getAccessToken()) {
      await api.reorderPhotos(backendPhotoIds);
    }
  }, []);

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
    async (targetUser) => {
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

      if (!getAccessToken()) return;

      try {
        await api.connect({ targetUserId: targetUser.id });
        await loadConversations();
      } catch (error) {
        if (error.status === 403) {
          hideUserLocally(targetUser.id);
        }
        setSocialError(error.message || "Could not sync connection. Using local fallback.");
      }
    },
    [blockedUserIds, hideUserLocally, loadConversations, pickAvatar]
  );

  /**
   * SEND MESSAGE:
   * - Adds message to conversation
   * - Updates match preview (lastMessage + updatedAt)
   */
  const sendMessage = useCallback(
    async ({ toUserId, text }) => {
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

      if (!getAccessToken()) return;

      try {
        await api.sendMessage(toUserId, { text: clean });
        await loadConversationMessages(toUserId);
        await loadConversations();
      } catch (error) {
        if (error.status === 403) {
          hideUserLocally(toUserId);
        }
        setSocialError(error.message || "Could not sync message. Using local fallback.");
      }
    },
    [blockedUserIds, hideUserLocally, loadConversationMessages, loadConversations]
  );

  /* =========================================================
     ACTIONS: SAFETY (BLOCK / REPORT)
  ========================================================= */

  const blockUser = useCallback(async (targetUserId) => {
    if (!targetUserId) return;

    hideUserLocally(targetUserId);
    setSocialError("");

    if (!getAccessToken()) return;

    try {
      await api.block({ targetUserId });
    } catch (error) {
      setSocialError(error.message || "Could not sync block. Using local fallback.");
    }
  }, [hideUserLocally]);

  const reportUser = useCallback(async ({ targetUserId, reason, details = "" }) => {
    if (!targetUserId || !reason?.trim()) return;

    const entry = {
      id: uid("rpt"),
      targetUserId,
      reason: reason.trim(),
      details: details.trim(),
      createdAt: nowISO(),
    };

    setReports((prev) => [entry, ...prev]);
    setSocialError("");

    if (!getAccessToken()) return;

    try {
      await api.report({
        targetUserId,
        reason: reason.trim(),
        details: details.trim(),
      });
    } catch (error) {
      setSocialError(error.message || "Could not sync report. Using local fallback.");
    }
  }, []);

  const reportAndBlock = useCallback(
    async ({ targetUserId, reason, details = "" }) => {
      await reportUser({ targetUserId, reason, details });
      await blockUser(targetUserId);
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
      authUser,
      authLoading,
      authError,
      socialLoading,
      socialError,
      isAuthenticated: Boolean(authUser || getAccessToken()),

      updateMe,
      updatePrefs,
      login,
      register,
      logout,
      refreshMe: loadBackendState,
      saveProfile,
      savePreferences,
      uploadProfilePhoto,
      deleteProfilePhoto,
      reorderProfilePhotos,
      loadConnections,
      loadConversations,
      loadConversationMessages,
      hideUserLocally,

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
      authUser,
      authLoading,
      authError,
      socialLoading,
      socialError,
      updateMe,
      updatePrefs,
      login,
      register,
      logout,
      loadBackendState,
      saveProfile,
      savePreferences,
      uploadProfilePhoto,
      deleteProfilePhoto,
      reorderProfilePhotos,
      loadConnections,
      loadConversations,
      loadConversationMessages,
      hideUserLocally,
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
