// 用户相关类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'locked';
  createdAt: string;
  lastLogin?: string;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface UserCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterInfo {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  inviteCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordReset {
  email: string;
  code?: string;
  newPassword?: string;
}

export interface UserProfile {
  displayName?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  preferences?: Record<string, any>;
}
