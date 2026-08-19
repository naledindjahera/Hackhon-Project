// Thin wrapper around fetch() so every component talks to the API the same way.
// In dev, Vite proxies "/api" -> http://localhost:5000 (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend URL.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body — fine for some responses
  }

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.details = data?.details;
    error.status = res.status;
    throw error;
  }

  return data;
}

export const projectsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/projects${query ? `?${query}` : ""}`);
  },
  get: (id) => request(`/projects/${id}`),
  create: (payload) =>
    request("/projects", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/projects/${id}`, { method: "DELETE" }),
  vote: (id, rating) =>
    request(`/projects/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    }),
};
