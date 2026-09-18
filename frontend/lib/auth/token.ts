import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "opaque_jwt";

export interface JwtClaims {
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    return jwtDecode<JwtClaims>(token);
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function isAuth(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    clearAuthToken();
    return false;
  }

  return true;
}

export function getAuthClaims(): JwtClaims | null {
  const token = getAuthToken();
  if (!token) return null;
  return decodeJwtPayload(token);
}
