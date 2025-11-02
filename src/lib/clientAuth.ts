// src/lib/clientAuth.ts
export type MiniUser = { nickname: string };

const KEY = "bolao_user";

export function setUser(u: MiniUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(u));
}

export function getUser(): MiniUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MiniUser;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
