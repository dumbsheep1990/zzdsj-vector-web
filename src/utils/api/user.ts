/**
 * 用户管理API服务
 */
import { User, UserCredentials, RegisterInfo, AuthResponse, PasswordReset, UserProfile } from '../../../shared/types/user';
import apiClient from './client';

const BASE_URL = 'user';
const AUTH_URL = 'auth';

/**
 * 用户API服务
 */
export const userApi = {
  /**
   * 用户登录
   */
  login(credentials: UserCredentials) {
    return apiClient.post<AuthResponse>(`${AUTH_URL}/login`, credentials);
  },
  
  /**
   * 用户注册
   */
  register(registerInfo: RegisterInfo) {
    return apiClient.post<AuthResponse>(`${AUTH_URL}/register`, registerInfo);
  },
  
  /**
   * 注销登录
   */
  logout() {
    return apiClient.post<{success: boolean}>(`${AUTH_URL}/logout`);
  },
  
  /**
   * 刷新令牌
   */
  refreshToken(refreshToken: string) {
    return apiClient.post<{token: string, expiresIn: number}>(`${AUTH_URL}/refresh-token`, { refreshToken });
  },
  
  /**
   * 忘记密码请求
   */
  forgotPassword(email: string) {
    return apiClient.post<{success: boolean}>(`${AUTH_URL}/forgot-password`, { email });
  },
  
  /**
   * 重置密码
   */
  resetPassword(resetInfo: PasswordReset) {
    return apiClient.post<{success: boolean}>(`${AUTH_URL}/reset-password`, resetInfo);
  },
  
  /**
   * 获取当前用户信息
   */
  getCurrentUser() {
    return apiClient.get<User>(`${BASE_URL}/me`);
  },
  
  /**
   * 更新当前用户资料
   */
  updateProfile(profile: UserProfile) {
    return apiClient.put<User>(`${BASE_URL}/profile`, profile);
  },
  
  /**
   * 更改密码
   */
  changePassword(oldPassword: string, newPassword: string) {
    return apiClient.put<{success: boolean}>(`${BASE_URL}/change-password`, {
      oldPassword,
      newPassword
    });
  },
  
  /**
   * 上传头像
   */
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.post<{avatarUrl: string}>(
      `${BASE_URL}/avatar`,
      formData,
      {
        headers: {
          // 移除Content-Type以让浏览器自动设置multipart/form-data
          'Content-Type': undefined as any
        }
      }
    );
  },
  
  // 管理员API
  
  /**
   * 获取用户列表（仅管理员）
   */
  getUsers(page = 1, pageSize = 20, filter?: Record<string, any>) {
    return apiClient.get<User[]>(`${BASE_URL}`, { page, pageSize, ...filter });
  },
  
  /**
   * 获取用户详情（仅管理员）
   */
  getUserById(id: string) {
    return apiClient.get<User>(`${BASE_URL}/${id}`);
  },
  
  /**
   * 创建用户（仅管理员）
   */
  createUser(user: Omit<User, 'id' | 'createdAt'>) {
    return apiClient.post<User>(`${BASE_URL}`, user);
  },
  
  /**
   * 更新用户（仅管理员）
   */
  updateUser(id: string, user: Partial<User>) {
    return apiClient.put<User>(`${BASE_URL}/${id}`, user);
  },
  
  /**
   * 删除用户（仅管理员）
   */
  deleteUser(id: string) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  /**
   * 锁定/解锁用户（仅管理员）
   */
  updateUserStatus(id: string, status: 'active' | 'inactive' | 'locked') {
    return apiClient.put<User>(`${BASE_URL}/${id}/status`, { status });
  },
  
  /**
   * 修改用户角色（仅管理员）
   */
  updateUserRole(id: string, role: 'admin' | 'user' | 'guest') {
    return apiClient.put<User>(`${BASE_URL}/${id}/role`, { role });
  }
};

export default userApi;
