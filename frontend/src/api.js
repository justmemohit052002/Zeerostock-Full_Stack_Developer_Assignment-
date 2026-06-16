// src/api.js  —  Base URL: change this if your backend runs on a different port
const API_BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

// ── Students ──────────────────────────────────────────────────────────────────
export const studentApi = {
  /** GET /students?page=1&limit=10&search=... */
  list: ({ page = 1, limit = 10, search = "" } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set("search", search);
    return request(`/students?${params}`);
  },

  /** GET /students/:id  (includes marks) */
  get: (id) => request(`/students/${id}`),

  /** POST /students */
  create: (body) => request("/students", { method: "POST", body: JSON.stringify(body) }),

  /** PUT /students/:id */
  update: (id, body) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  /** DELETE /students/:id */
  delete: (id) => request(`/students/${id}`, { method: "DELETE" }),
};

// ── Marks ─────────────────────────────────────────────────────────────────────
export const marksApi = {
  /** POST /students/:studentId/marks */
  add: (studentId, body) =>
    request(`/students/${studentId}/marks`, { method: "POST", body: JSON.stringify(body) }),

  /** PUT /marks/:id  (if your backend supports editing a single mark) */
  update: (markId, body) =>
    request(`/marks/${markId}`, { method: "PUT", body: JSON.stringify(body) }),

  /** DELETE /marks/:id */
  delete: (markId) => request(`/marks/${markId}`, { method: "DELETE" }),
};
