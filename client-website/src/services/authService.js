import { API_BASE_URL } from "../api/api";

export async function loginRequest(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login falhou");
  }

  return response.json();
}