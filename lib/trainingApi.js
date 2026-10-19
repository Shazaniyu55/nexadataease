const API = process.env.NEXT_PUBLIC_API_URL || "https://server-eight-iota-76.vercel.app";
export const KEY = "nde_token";
export const ADMIN_KEY = "nde_admin_token";

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