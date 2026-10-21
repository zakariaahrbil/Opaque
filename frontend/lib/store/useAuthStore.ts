import { create } from "zustand";
import { getAuthToken, setAuthToken, clearAuthToken, decodeJwtPayload, isAuth, setUnlockVerifier, getUnlockVerifier, clearUnlockVerifier } from "../auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  userEmail: string | null;
  masterKey: Uint8Array<ArrayBuffer> | null;
  unlockVerifier: string | null;

  isAuthenticated: () => boolean;
  isVaultUnlocked: () => boolean;
  isUnlockVerifierMatched: (verifier: string) => boolean;

  initialize: () => void;
  login: (token: string, masterKey: Uint8Array<ArrayBuffer>, unlockVerifier: string, email?: string) => void;
  logout: () => void;
  lockVault: () => void;
  unlockVault: (masterKey: Uint8Array<ArrayBuffer>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  token: null,
  userEmail: null,
  masterKey: null,
  unlockVerifier: null,

  isAuthenticated: () => get().status === "authenticated",
  isVaultUnlocked: () => get().status === "authenticated" && get().masterKey !== null,
  isUnlockVerifierMatched: (verifier: string) => get().unlockVerifier === verifier,

  initialize: () => {
    if (typeof window === "undefined") return;

    if (isAuth()) {
      const token = getAuthToken();
      const unlockVerifier = getUnlockVerifier();
      const claims = token ? decodeJwtPayload(token) : null;
      set({
        status: "authenticated",
        token,
        userEmail: (claims?.email || claims?.sub || null) as string | null,
        unlockVerifier: unlockVerifier,
      });
    } else {
      set({
        status: "unauthenticated",
        token: null,
        userEmail: null,
        masterKey: null,
        unlockVerifier: null,
      });
    }
  },

  login: (token: string, masterKey: Uint8Array<ArrayBuffer>, unlockVerifier: string, email?: string) => {
    setAuthToken(token);
    setUnlockVerifier(unlockVerifier);
    const claims = decodeJwtPayload(token);
    set({
      status: "authenticated",
      token,
      userEmail: email || (claims?.email || claims?.sub || null) as string | null,
      masterKey: masterKey,
      unlockVerifier: unlockVerifier,
    });
  },

  logout: () => {
    clearAuthToken();
    clearUnlockVerifier();
    set({
      status: "unauthenticated",
      token: null,
      userEmail: null,
      masterKey: null,
      unlockVerifier: null,
    });
  },

  lockVault: () => {
    set({ masterKey: null });
  },

  unlockVault: (masterKey: Uint8Array<ArrayBuffer>) => {
    set({ masterKey });
  },
}));


