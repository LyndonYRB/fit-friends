const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TOKEN_KEY = "athlynk_access_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = data?.error || data?.message || "Something went wrong.";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  login: (body) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => apiRequest("/me"),

  getProfile: () => apiRequest("/profile/me"),

  saveProfile: (body) =>
    apiRequest("/profile/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  getPreferences: () => apiRequest("/preferences"),

  savePreferences: (body) =>
    apiRequest("/preferences", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  discover: (query = "") => apiRequest(`/discover${query}`),

  getUser: (id) => apiRequest(`/users/${id}`),

  swipe: (body) =>
    apiRequest("/swipes", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  connect: (body) =>
    apiRequest("/connections", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getConnections: () => apiRequest("/connections"),

  getConversations: () => apiRequest("/conversations"),

  getMessages: (userId) => apiRequest(`/conversations/${userId}/messages`),

  sendMessage: (userId, body) =>
    apiRequest(`/conversations/${userId}/messages`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    return apiRequest("/photos", {
      method: "POST",
      body: formData,
    });
  },

  deletePhoto: (id) =>
    apiRequest(`/photos/${id}`, {
      method: "DELETE",
    }),

  reorderPhotos: (photoIds) =>
    apiRequest("/profile/me/photos", {
      method: "PATCH",
      body: JSON.stringify({ photoIds }),
    }),

  block: (body) =>
    apiRequest("/blocks", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  report: (body) =>
    apiRequest("/reports", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
