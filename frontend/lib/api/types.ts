export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  data?: unknown;

  constructor(message: string, status?: number, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export type Category = "Social Media" | "Utils" | "Bank" | "Email" | "Documents" | "Others";

export interface VaultItemRequest {
  title: string,
  website?: string,
  category: Category,
  iv: string  
  encryptedData: string
}

export interface VaultItemResponse  {
  id: string,
  title: string,
  website?: string,
  category: Category,
  iv: string
  encryptedData: string,
  createdAt: string,
  updatedAt: string,
}

export type VaultItemBulkResponse = VaultItemResponse []

export interface VaultItemCreateRequest {
  id?: string
  title: string,
  website: string,
  category: Category
  username: string
  password: string
}

