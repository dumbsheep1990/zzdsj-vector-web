// 认证相关类型定义

import { BaseEntity, UserInfo } from './common';

export interface LoginRequest {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserInfo;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface AuthUser extends BaseEntity {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  preferences?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface UserProfile {
  user_id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
}

export interface UserSettings {
  user_id: number;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'contacts';
    show_email: boolean;
    show_phone: boolean;
  };
}

export interface UserPreferences {
  user_id: number;
  default_model: string;
  default_temperature: number;
  default_max_tokens: number;
  auto_save: boolean;
  auto_backup: boolean;
  preferred_language: string;
  custom_prompts: Record<string, string>;
}

// 权限相关
export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  permissions: Permission[];
}

export interface AuthContext {
  user: AuthUser | null;
  isAuthenticated: boolean;
  permissions: string[];
  roles: string[];
}

// 会话相关
export interface Session {
  id: string;
  user_id: number;
  device_info?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
} 