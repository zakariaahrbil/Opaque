import { create } from "zustand";
import { getAuthToken, setAuthToken, clearAuthToken, decodeJwtPayload, isAuth } from "../isAuth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  userEmail: string | null;
  masterKey: Uint8Array | null;
  
  isAuthenticated: () => boolean;
  isVaultUnlocked: () => boolean;

  initialize: () => void;
  login: (token: string, masterKey?: Uint8Array, email?: string) => void;
  logout: () => void;
  lockVault: () => void;
  unlockVault: (masterKey: Uint8Array) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  token: null,
  userEmail: null,
  masterKey: null,

  isAuthenticated: () => get().status === "authenticated",
  isVaultUnlocked: () => get().status === "authenticated" && get().masterKey !== null,

  initialize: () => {
    if (typeof window === "undefined") return;

    if (isAuth()) {
      const token = getAuthToken();
      const claims = token ? decodeJwtPayload(token) : null;
      set({
        status: "authenticated",
        token,
        userEmail: (claims?.email || claims?.sub || null) as string | null,
      });
    } else {
      set({
        status: "unauthenticated",
        token: null,
        userEmail: null,
        masterKey: null,
      });
    }
  },

  login: (token: string, masterKey?: Uint8Array, email?: string) => {
    setAuthToken(token);
    const claims = decodeJwtPayload(token);
    set({
      status: "authenticated",
      token,
      userEmail: email || (claims?.email || claims?.sub || null) as string | null,
      masterKey: masterKey ?? null,
    });
  },

  logout: () => {
    clearAuthToken();
    set({
      status: "unauthenticated",
      token: null,
      userEmail: null,
      masterKey: null,
    });
  },

  lockVault: () => {
    set({ masterKey: null });
  },

  unlockVault: (masterKey: Uint8Array) => {
    set({ masterKey });
  },
}));


