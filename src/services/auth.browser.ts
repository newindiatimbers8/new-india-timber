/**
 * Browser-Compatible Authentication Service
 * Handles user authentication without Node.js dependencies
 */

import type { 
  UserAccount, 
  AdminProfile, 
  LoginRequest, 
  LoginResponse, 
  UserProfile,
  JWTPayload,
  UserRole,
  Permission,
  PERMISSIONS
} from '@/types/auth';
import { storageService } from './storage';

// Browser-compatible crypto functions
class BrowserCrypto {
  private static readonly SALT = 'timber-craft-2024';

  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + BrowserCrypto.SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const computedHash = await BrowserCrypto.hashPassword(password);
    return computedHash === hashedPassword;
  }

  static generateToken(user: UserAccount): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
    
    // Simple base64 encoding (demo purposes - use proper JWT in production)
    return btoa(JSON.stringify(payload));
  }

  static validateToken(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
    try {
      const payload = JSON.parse(atob(token)) as JWTPayload;
      
      // Check if token is expired
      if (Date.now() > payload.exp) {
        return { valid: false, error: 'TOKEN_EXPIRED' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: 'INVALID_TOKEN' };
    }
  }
}

export class AuthService {
  private currentUser: UserAccount | null = null;
  private sessionStorage = new Map<string, UserAccount>();
  private loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Check rate limiting
      if (!this.checkRateLimit(credentials.email)) {
        return {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many login attempts. Please try again later.',
          },
        };
      }

      // Find user by email
      const user = await storageService.findBy<UserAccount>('users', 'email', credentials.email);
      
      if (!user) {
        this.recordLoginAttempt(credentials.email, false);
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        };
      }

      // Verify password
      const isValidPassword = await BrowserCrypto.verifyPassword(credentials.password, user.password);
      
      if (!isValidPassword) {
        this.recordLoginAttempt(credentials.email, false);
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        };
      }

      // Check user status
      if (user.status !== 'active') {
        return {
          success: false,
          error: {
            code: 'ACCOUNT_DISABLED',
            message: 'Account is disabled. Please contact support.',
          },
        };
      }

      // Generate token and create session
      const token = BrowserCrypto.generateToken(user);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Update user login info
      await storageService.update<UserAccount>('users', user.id, {
        lastLoginAt: new Date().toISOString(),
      });

      // Store session
      this.sessionStorage.set(token, user);
      this.currentUser = user;

      // Reset login attempts on successful login
      this.recordLoginAttempt(credentials.email, true);

      return {
        success: true,
        token,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during login',
        },
      };
    }
  }

  async logout(token: string): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      // Validate token first
      const validation = BrowserCrypto.validateToken(token);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
          },
        };
      }

      // Remove from session storage
      this.sessionStorage.delete(token);
      this.currentUser = null;

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during logout',
        },
      };
    }
  }

  getCurrentUser(): UserAccount | null {
    return this.currentUser;
  }

  async refreshToken(token: string): Promise<{ success: boolean; token?: string; expiresAt?: string; error?: any }> {
    try {
      const validation = BrowserCrypto.validateToken(token);
      
      if (!validation.valid || !validation.payload) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
          },
        };
      }

      // Get user from storage to ensure they still exist and are active
      const user = await storageService.get<UserAccount>('users', validation.payload.userId);
      
      if (!user || user.status !== 'active') {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found or inactive',
          },
        };
      }

      // Generate new token
      const newToken = BrowserCrypto.generateToken(user);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Update session storage
      this.sessionStorage.delete(token);
      this.sessionStorage.set(newToken, user);

      return {
        success: true,
        token: newToken,
        expiresAt,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during token refresh',
        },
      };
    }
  }

  // Role-based access control
  hasPermission(userRole: UserRole, permission: Permission): boolean {
    const rolePermissions: Record<UserRole, Permission[]> = {
      admin: ['products', 'blog', 'orders', 'seo', 'users'],
      editor: ['blog', 'seo'],
      visitor: [],
    };

    return rolePermissions[userRole]?.includes(permission) || false;
  }

  // User profile management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await storageService.get<UserAccount>('users', userId);
      if (!user) {
        return null;
      }

      const profile: UserProfile = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
      };

      // Get admin profile if user is admin
      if (user.role === 'admin') {
        const adminProfile = await storageService.findBy<AdminProfile>('admin-profiles', 'userId', userId);
        if (adminProfile) {
          profile.adminProfile = adminProfile;
        }
      }

      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Session management
  async validateSession(token: string): Promise<{
    valid: boolean;
    userId?: string;
    email?: string;
    role?: UserRole;
    expiresAt?: string;
    error?: string;
  }> {
    const validation = BrowserCrypto.validateToken(token);
    
    if (!validation.valid || !validation.payload) {
      return { valid: false, error: validation.error || 'INVALID_TOKEN' };
    }

    const { userId, email, role, exp } = validation.payload;

    return {
      valid: true,
      userId,
      email,
      role,
      expiresAt: new Date(exp).toISOString(),
    };
  }

  createSession(user: UserAccount): { token: string; expiresAt: string } {
    const token = BrowserCrypto.generateToken(user);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    this.sessionStorage.set(token, user);
    return { token, expiresAt };
  }

  // Password management
  async hashPassword(password: string): Promise<string> {
    return BrowserCrypto.hashPassword(password);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return BrowserCrypto.verifyPassword(password, hashedPassword);
  }

  // Rate limiting
  getLoginAttempts(email: string): number {
    const attempts = this.loginAttempts.get(email);
    return attempts ? attempts.count : 0;
  }

  recordLoginAttempt(email: string, success: boolean): void {
    if (success) {
      // Reset attempts on successful login
      this.loginAttempts.delete(email);
      return;
    }

    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: new Date() };
    attempts.count += 1;
    attempts.lastAttempt = new Date();
    this.loginAttempts.set(email, attempts);
  }

  private checkRateLimit(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return true;

    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

    if (attempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      return timeSinceLastAttempt > LOCKOUT_DURATION;
    }

    return true;
  }
}

// Export singleton instance and methods
export const authService = new AuthService();

// Export individual methods for contract tests compatibility
export const login = (credentials: LoginRequest) => authService.login(credentials);
export const logout = (token: string) => authService.logout(token);
export const getCurrentUser = () => authService.getCurrentUser();
export const refreshToken = (token: string) => authService.refreshToken(token);
export const hasPermission = (userRole: UserRole, permission: Permission) => authService.hasPermission(userRole, permission);
export const getUserProfile = (userId: string) => authService.getUserProfile(userId);
export const validateSession = (token: string) => authService.validateSession(token);
export const createSession = (user: UserAccount) => authService.createSession(user);
export const hashPassword = (password: string) => authService.hashPassword(password);
export const verifyPassword = (password: string, hashedPassword: string) => authService.verifyPassword(password, hashedPassword);
export const getLoginAttempts = (email: string) => authService.getLoginAttempts(email);
export const recordLoginAttempt = (email: string, success: boolean) => authService.recordLoginAttempt(email, success);

export default authService;
