export interface UserAccount {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'visitor' | 'editor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AdminProfile {
  userId: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  permissions?: string[];
}

export interface SessionState {
  userId: string;
  role: 'visitor' | 'editor' | 'admin';
  expiresAt: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserAccount;
  session: SessionState;
  adminProfile?: AdminProfile;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthError {
  message: string;
  code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'EMAIL_EXISTS' | 'INVALID_TOKEN' | 'TOKEN_EXPIRED';
}