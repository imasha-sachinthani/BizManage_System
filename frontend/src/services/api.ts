// Prefer VITE_API_URL, otherwise default to the backend dev server used by this repo
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:4000/api';

// Debug: Log the API base URL and environment for easier troubleshooting
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Vite env:', (import.meta as any).env);

import { authService } from './auth';

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

// Generic API error
export class ApiError extends Error {
  public statusCode: number;
  public errors?: Array<{ field: string; message: string; value?: any }>;

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (response.status === 401) {
    try {
      authService.logout();
    } catch (e) {
      // ignore
    }
    throw new ApiError('Unauthorized', 401);
  }

  if (!response.ok) {
    throw new ApiError(
      data.error || data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }

  if (!data.success) {
    throw new ApiError(
      data.error || data.message || 'API returned unsuccessful response',
      response.status,
      data.errors
    );
  }

  return data.data!;
}

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Generic HTTP methods
const api = {
  get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return handleResponse<T>(response);
  },
};

export default api;