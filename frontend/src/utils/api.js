export const apiUrl = import.meta.env.VITE_API_URL ?? "";

export function getAuthHeaders() {
  const stored = localStorage.getItem("user");
  if (!stored) return {};

  try {
    const user = JSON.parse(stored);
    return user.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch {
    return {};
  }
}
