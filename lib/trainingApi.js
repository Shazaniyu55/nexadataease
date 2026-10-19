const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const KEY = "nde_token";
export const ADMIN_KEY = "nde_admin_token";
export const INSTRUCTOR_KEY = "nde_instructor_token";

export async function api(path, method = "GET", body, key = KEY) {
  const token = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  const res = await fetch(`${API}/api${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
export const saveToken = (t, key = KEY) => localStorage.setItem(key, t);
export const clearToken = (key = KEY) => localStorage.removeItem(key);
export const hasToken = (key = KEY) => typeof window !== "undefined" && !!localStorage.getItem(key);
export const iapi = (path, method, body) => api(path, method, body, INSTRUCTOR_KEY); // instructor-authenticated call
// only follow ?next= links that stay inside /training
export const safeNext = (n) => (typeof n === "string" && /^\/training\/[\w\-/]*$/.test(n) ? n : "/training/dashboard");