// utils/authApi.js
import { apiUrl } from "./api";

export async function registerUser(data) {
  const res = await fetch(`${apiUrl}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return { ok: res.ok, result };
}

export async function loginUser(data) {
  const res = await fetch(`${apiUrl}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return { ok: res.ok, result };
}
