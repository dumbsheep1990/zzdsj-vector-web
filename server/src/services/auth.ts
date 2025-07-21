import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { 
  LoginCredentials, 
  AuthResponse, 
  RefreshTokenRequest, 
  ApiKey, 
  CreateApiKeyRequest,
  TokenInfo 
} from '../../../shared/types/auth';
import { User } from '../../../shared/types/user';
import { logger } from '../utils/logger';
import { apiClient } from '../utils/apiClient';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  AuthUser,
  UserProfile,
  UserSettings,
  UserPreferences
} from '../types/auth';
import { ApiResponse } from '../types/common';

// JWT密钥（生产环境应从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-jwt-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$uF6Qhj9uB.VJljBvTSVRs.MqveouETaF8D2yD6JMxCgw.A7QSqSUC', // admin123
    fullName: '系统管理员',
    avatar: '/avatars/admin.png',
    isSuperUser: true,
    isActive: true,
    roles: ['admin'],
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2025-05-15T14:30:00Z'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: '$2b$10$uF6Qhj9uB.VJljBvTSVRs.MqveouETaF8D2yD6JMxCgw.A7QSqSUC', // admin123
    fullName: '普通用户',
    avatar: '/avatars/user.png',
    isSuperUser: false,
    isActive: true,
    roles: ['user'],
    createdAt: '2023-01-02T00:00:00Z',
    lastLogin: '2025-05-14T10:15:00Z'
  }
];

// 模拟API密钥数据
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: '管理后台',
    masked_key: 'sk_••••••••••ABCD',
    user_id: '1',
    scopes: ['read', 'write'],
    created_at: '2025-01-01T00:00:00Z',
    last_used_at: '2025-05-10T08:30:00Z'
  }
];

// 模拟Token信息
const mockTokens: TokenInfo[] = [];

export class AuthService {
  private readonly baseUrl = '/api/frontend/user';

  // 用户认证
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      logger.info('Attempting user login', { username: credentials.username });
      
      const response = await apiClient.post<LoginResponse>(
        `${this.baseUrl}/auth/login`,
        credentials
      );
      
      if (response.success && response.data) {
        // 存储认证信息
        apiClient.setAuthToken(response.data.access_token);
        apiClient.setRefreshToken(response.data.refresh_token);
        
        logger.info('User login successful', { 
          userId: response.data.user.id,
          username: response.data.user.username 
        });
        
        return response.data;
      }
      
      throw new Error(response.message || '登录失败');
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  // 用户注册
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      logger.info('Attempting user registration', { username: userData.username, email: userData.email });
      
      const response = await apiClient.post<LoginResponse>(
        `${this.baseUrl}/auth/register`,
        userData
      );
      
      if (response.success && response.data) {
        // 注册成功后自动登录
        apiClient.setAuthToken(response.data.access_token);
        apiClient.setRefreshToken(response.data.refresh_token);
        
        logger.info('User registration successful', { 
          userId: response.data.user.id,
          username: response.data.user.username 
        });
        
        return response.data;
      }
      
      throw new Error(response.message || '注册失败');
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    try {
      const response = await apiClient.post<TokenRefreshResponse>(
        `${this.baseUrl}/auth/refresh`,
        { refresh_token: refreshToken }
      );
      
      if (response.success && response.data) {
        // 更新认证信息
        apiClient.setAuthToken(response.data.access_token);
        
        logger.info('Token refresh successful');
        return response.data;
      }
      
      throw new Error(response.message || '令牌刷新失败');
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  // 登出
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/auth/logout`);
      
      // 清除本地认证信息
      apiClient.setAuthToken('');
      apiClient.setRefreshToken('');
      
      logger.info('User logout successful');
    } catch (error) {
      logger.error('Logout failed:', error);
      // 即使后端登出失败，也清除本地认证信息
      apiClient.setAuthToken('');
      apiClient.setRefreshToken('');
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<AuthUser> {
    try {
      const response = await apiClient.get<AuthUser>(`${this.baseUrl}/profile/me`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '获取用户信息失败');
    } catch (error) {
      logger.error('Get current user failed:', error);
      throw error;
    }
  }

  // 修改密码
  async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/auth/change-password`,
        passwordData
      );
      
      if (!response.success) {
        throw new Error(response.message || '密码修改失败');
      }
      
      logger.info('Password change successful');
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  }

  // 重置密码请求
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/auth/reset-password`,
        { email }
      );
      
      if (!response.success) {
        throw new Error(response.message || '密码重置请求失败');
      }
      
      logger.info('Password reset request successful', { email });
    } catch (error) {
      logger.error('Password reset request failed:', error);
      throw error;
    }
  }

  // 确认密码重置
  async confirmPasswordReset(resetData: PasswordResetConfirmRequest): Promise<void> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/auth/reset-password/confirm`,
        resetData
      );
      
      if (!response.success) {
        throw new Error(response.message || '密码重置失败');
      }
      
      logger.info('Password reset confirmation successful');
    } catch (error) {
      logger.error('Password reset confirmation failed:', error);
      throw error;
    }
  }

  // 用户资料管理
  async getUserProfile(userId?: number): Promise<UserProfile> {
    try {
      const url = userId 
        ? `${this.baseUrl}/profile/${userId}`
        : `${this.baseUrl}/profile/me`;
        
      const response = await apiClient.get<UserProfile>(url);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '获取用户资料失败');
    } catch (error) {
      logger.error('Get user profile failed:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(
        `${this.baseUrl}/profile/me`,
        profileData
      );
      
      if (response.success && response.data) {
        logger.info('User profile update successful');
        return response.data;
      }
      
      throw new Error(response.message || '更新用户资料失败');
    } catch (error) {
      logger.error('Update user profile failed:', error);
      throw error;
    }
  }

  // 用户设置管理
  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await apiClient.get<UserSettings>(`${this.baseUrl}/settings`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '获取用户设置失败');
    } catch (error) {
      logger.error('Get user settings failed:', error);
      throw error;
    }
  }

  async updateUserSettings(settingsData: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await apiClient.put<UserSettings>(
        `${this.baseUrl}/settings`,
        settingsData
      );
      
      if (response.success && response.data) {
        logger.info('User settings update successful');
        return response.data;
      }
      
      throw new Error(response.message || '更新用户设置失败');
    } catch (error) {
      logger.error('Update user settings failed:', error);
      throw error;
    }
  }

  // 用户偏好管理
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const response = await apiClient.get<UserPreferences>(`${this.baseUrl}/preferences`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || '获取用户偏好失败');
    } catch (error) {
      logger.error('Get user preferences failed:', error);
      throw error;
    }
  }

  async updateUserPreferences(preferencesData: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const response = await apiClient.put<UserPreferences>(
        `${this.baseUrl}/preferences`,
        preferencesData
      );
      
      if (response.success && response.data) {
        logger.info('User preferences update successful');
        return response.data;
      }
      
      throw new Error(response.message || '更新用户偏好失败');
    } catch (error) {
      logger.error('Update user preferences failed:', error);
      throw error;
    }
  }

  // 验证令牌有效性
  async validateToken(): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/auth/validate`);
      return response.success;
    } catch (error) {
      logger.debug('Token validation failed:', error);
      return false;
    }
  }

  // 获取用户权限
  async getUserPermissions(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ permissions: string[] }>(`${this.baseUrl}/permissions`);
      
      if (response.success && response.data) {
        return response.data.permissions;
      }
      
      return [];
    } catch (error) {
      logger.error('Get user permissions failed:', error);
      return [];
    }
  }
}

export const authService = new AuthService();
