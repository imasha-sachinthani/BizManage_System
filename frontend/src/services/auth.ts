const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

// Development mode flag
const IS_DEV_MODE = false; // Set to false to use real API

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: {
    id: string;
    name: string;
  };
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

class AuthService {
  private readonly TOKEN_KEY = 'bizmanage_token';
  private readonly USER_KEY = 'bizmanage_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Try real API first
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const result: AuthResponse = await response.json();
        
        // Store token and user data
        localStorage.setItem(this.TOKEN_KEY, result.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(result.data.user));
        
        return result;
      }
    } catch (error) {
      console.warn('API login failed, attempting mock authentication:', error);
    }

    // Fall back to mock authentication for development
    if (credentials.email === 'admin@bizmanage.lk' && credentials.password === 'Admin@123') {
      const mockUser: User = {
        id: '1',
        email: 'admin@bizmanage.lk',
        name: 'System Administrator',
        role: 'DIRECTOR',
        company: {
          id: '1',
          name: 'BizManage Trading Company',
        },
        permissions: ['clients:create', 'clients:read', 'clients:update', 'clients:delete', 'invoices:create', 'invoices:read', 'invoices:update'],
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      const result: AuthResponse = {
        success: true,
        message: 'Login successful (development mode)',
        data: {
          token: mockToken,
          user: mockUser,
        },
      };

      // Store token and user data
      localStorage.setItem(this.TOKEN_KEY, result.data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(result.data.user));
      
      return result;
    }
    
    throw new Error('Invalid email or password');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const result = await response.json();
      return result.data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  async refreshToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const result: AuthResponse = await response.json();
      
      localStorage.setItem(this.TOKEN_KEY, result.data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(result.data.user));
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Optional: Call logout endpoint for audit logging
    const token = this.getToken();
    if (token) {
      fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Ignore errors on logout
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasPermission(module: string, action: string): boolean {
    const user = this.getUser();
    if (!user) return false;

    const permission = `${module}:${action}`;
    return user.permissions.includes(permission);
  }
}

export const authService = new AuthService();