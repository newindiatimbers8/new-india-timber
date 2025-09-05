import { account, databases, appwriteConfig } from '@/lib/appwrite';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  phone?: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: {
    companyName?: string;
    usagePreference?: 'own_premium' | 'own_budget';
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  usagePreference?: 'own_premium' | 'own_budget';
}

class AuthService {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );

      // Get user data after login
      const user = await account.get();
      return user as User;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<User> {
    try {
      // Create account
      const userAccount = await account.create(
        ID.unique(),
        userData.email,
        userData.password,
        userData.name
      );

      // Create email session
      await account.createEmailPasswordSession(
        userData.email,
        userData.password
      );

      // Update user preferences with additional data
      const prefs = {
        companyName: userData.companyName || '',
        usagePreference: userData.usagePreference || '',
        phone: userData.phone || ''
      };

      await account.updatePrefs(prefs);

      // Get updated user data
      const user = await account.get();
      return user as User;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return user as User;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  }

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  // Reset password
  async resetPassword(
    userId: string,
    secret: string,
    password: string
  ): Promise<void> {
    try {
      await account.updateRecovery(userId, secret, password, password);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User['prefs']>): Promise<User> {
    try {
      await account.updatePrefs(updates);
      const user = await account.get();
      return user as User;
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    try {
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send verification email');
    }
  }

  // Verify email
  async verifyEmail(userId: string, secret: string): Promise<void> {
    try {
      await account.updateVerification(userId, secret);
    } catch (error: any) {
      throw new Error(error.message || 'Email verification failed');
    }
  }

  // OAuth login (Google, Facebook)
  async oauthLogin(provider: 'google' | 'facebook'): Promise<void> {
    try {
      account.createOAuth2Session(
        provider,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/login`
      );
    } catch (error: any) {
      throw new Error(error.message || 'OAuth login failed');
    }
  }
}

export const authService = new AuthService();
export default authService;
