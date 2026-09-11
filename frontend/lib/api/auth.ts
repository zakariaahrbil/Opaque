import apiClient from "./client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "./types";

/**
 * Authenticates a user with email and derived login verifier key.
 * @param payload Credentials including email and login verifier
 * @returns LoginResponse containing JWT authentication token
 */
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/api/auth/login", payload);
  return response.data;
}

/**
 * Registers a new vault account with email and derived login verifier key.
 * @param payload Registration credentials including email and login verifier
 */
export async function registerUser(payload: RegisterRequest): Promise<void> {
  await apiClient.post<void>("/api/auth/register", payload);
}

export const authApi = {
  login: loginUser,
  register: registerUser,
};
