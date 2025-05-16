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

class AuthService {
  private apiUrl: string;
  private useMock: boolean;
  
  constructor() {
    this.apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    this.useMock = process.env.USE_MOCK_DATA === 'true';
  }
  
  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.useMock) {
      logger.info(`使用模拟数据登录, 用户名: ${credentials.username}`);
      
      // 查找用户
      const user = mockUsers.find(u => u.username === credentials.username);
      if (!user) {
        logger.warn(`登录失败: 用户不存在 - ${credentials.username}`);
        throw new Error('用户名或密码错误');
      }
      
      // 验证密码
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) {
        logger.warn(`登录失败: 密码错误 - ${credentials.username}`);
        throw new Error('用户名或密码错误');
      }
      
      // 生成Token
      const token_payload = { 
        sub: user.id, 
        username: user.username,
        roles: user.roles,
        is_superuser: user.isSuperUser
      };
      
      const access_token = jwt.sign(token_payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const refresh_token = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
      
      // 记录Token信息
      const tokenInfo: TokenInfo = {
        id: uuidv4(),
        user_id: user.id,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1小时后过期
        created_at: new Date().toISOString(),
        device_info: 'Web Browser'
      };
      
      mockTokens.push(tokenInfo);
      
      // 构建响应
      const userCopy = { ...user };
      delete userCopy.password; // 移除密码
      
      // 更新最后登录时间
      const index = mockUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        mockUsers[index].lastLogin = new Date().toISOString();
      }
      
      const authResponse: AuthResponse = {
        access_token,
        refresh_token,
        token_type: 'Bearer',
        expires_in: 3600, // 1小时
        user: userCopy
      };
      
      return authResponse;
    }
    
    try {
      logger.info(`向后端API发送登录请求, 用户名: ${credentials.username}`);
      const response = await axios.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials);
      return response.data;
    } catch (error) {
      logger.error('登录失败:', error);
      throw new Error('登录失败，请检查用户名和密码');
    }
  }
  
  /**
   * 刷新令牌
   */
  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    if (this.useMock) {
      logger.info('使用模拟数据刷新令牌');
      
      try {
        // 验证刷新令牌
        const decoded = jwt.verify(request.refresh_token, JWT_REFRESH_SECRET) as any;
        const userId = decoded.sub;
        
        // 查找用户
        const user = mockUsers.find(u => u.id === userId);
        if (!user) {
          logger.warn(`刷新令牌失败: 用户不存在 - ID: ${userId}`);
          throw new Error('无效的刷新令牌');
        }
        
        // 生成新Token
        const token_payload = { 
          sub: user.id, 
          username: user.username,
          roles: user.roles,
          is_superuser: user.isSuperUser
        };
        
        const access_token = jwt.sign(token_payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refresh_token = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        
        // 记录新Token信息
        const tokenInfo: TokenInfo = {
          id: uuidv4(),
          user_id: user.id,
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          device_info: 'Web Browser'
        };
        
        mockTokens.push(tokenInfo);
        
        // 构建响应
        const userCopy = { ...user };
        delete userCopy.password; // 移除密码
        
        const authResponse: AuthResponse = {
          access_token,
          refresh_token,
          token_type: 'Bearer',
          expires_in: 3600, // 1小时
          user: userCopy
        };
        
        return authResponse;
      } catch (error) {
        logger.error('刷新令牌失败:', error);
        throw new Error('无效的刷新令牌');
      }
    }
    
    try {
      logger.info('向后端API发送刷新令牌请求');
      const response = await axios.post<AuthResponse>(`${this.apiUrl}/api/auth/refresh`, request);
      return response.data;
    } catch (error) {
      logger.error('刷新令牌失败:', error);
      throw new Error('刷新令牌失败');
    }
  }
  
  /**
   * 注销
   */
  async logout(token: string): Promise<boolean> {
    if (this.useMock) {
      logger.info('使用模拟数据注销');
      
      try {
        // 验证令牌
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.sub;
        
        // 从token列表中移除
        const index = mockTokens.findIndex(t => t.user_id === userId);
        if (index !== -1) {
          mockTokens.splice(index, 1);
        }
        
        return true;
      } catch (error) {
        logger.error('注销失败:', error);
        return false;
      }
    }
    
    try {
      logger.info('向后端API发送注销请求');
      await axios.post(`${this.apiUrl}/api/auth/logout`, { token });
      return true;
    } catch (error) {
      logger.error('注销失败:', error);
      return false;
    }
  }
  
  /**
   * 验证令牌
   */
  async validateToken(token: string): Promise<boolean> {
    if (this.useMock) {
      logger.info('使用模拟数据验证令牌');
      
      try {
        // 验证令牌
        jwt.verify(token, JWT_SECRET);
        return true;
      } catch (error) {
        logger.error('令牌验证失败:', error);
        return false;
      }
    }
    
    try {
      logger.info('向后端API发送令牌验证请求');
      const response = await axios.post<{ valid: boolean }>(`${this.apiUrl}/api/auth/validate`, { token });
      return response.data.valid;
    } catch (error) {
      logger.error('令牌验证失败:', error);
      return false;
    }
  }
  
  /**
   * 注册新用户
   */
  async register(user: Partial<User>): Promise<User> {
    if (this.useMock) {
      logger.info(`使用模拟数据注册新用户, 用户名: ${user.username}`);
      
      // 检查用户名是否已存在
      if (mockUsers.some(u => u.username === user.username)) {
        logger.warn(`注册失败: 用户名已存在 - ${user.username}`);
        throw new Error('用户名已存在');
      }
      
      // 检查邮箱是否已存在
      if (user.email && mockUsers.some(u => u.email === user.email)) {
        logger.warn(`注册失败: 邮箱已存在 - ${user.email}`);
        throw new Error('邮箱已被使用');
      }
      
      // 加密密码
      const hashedPassword = await bcrypt.hash(user.password || 'default123', 10);
      
      // 创建新用户
      const newUser: User = {
        id: uuidv4(),
        username: user.username || '',
        email: user.email || '',
        password: hashedPassword,
        fullName: user.fullName || user.username || '',
        avatar: user.avatar || '/avatars/default.png',
        isSuperUser: false,
        isActive: true,
        roles: ['user'], // 默认角色
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      
      // 返回新用户（排除密码）
      const userCopy = { ...newUser };
      delete userCopy.password;
      
      return userCopy;
    }
    
    try {
      logger.info(`向后端API发送注册请求, 用户名: ${user.username}`);
      const response = await axios.post<User>(`${this.apiUrl}/api/auth/register`, user);
      return response.data;
    } catch (error) {
      logger.error('注册失败:', error);
      throw new Error('注册失败');
    }
  }
  
  /**
   * 获取当前用户的API密钥
   */
  async getApiKeys(userId: string): Promise<ApiKey[]> {
    if (this.useMock) {
      logger.info(`使用模拟数据获取API密钥, 用户ID: ${userId}`);
      
      // 过滤属于该用户的API密钥
      const keys = mockApiKeys.filter(k => k.user_id === userId);
      return JSON.parse(JSON.stringify(keys));
    }
    
    try {
      logger.info(`向后端API获取API密钥, 用户ID: ${userId}`);
      const response = await axios.get<ApiKey[]>(`${this.apiUrl}/api/auth/api-keys?userId=${userId}`);
      return response.data;
    } catch (error) {
      logger.error(`获取API密钥失败, 用户ID: ${userId}:`, error);
      throw new Error('获取API密钥失败');
    }
  }
  
  /**
   * 创建API密钥
   */
  async createApiKey(userId: string, request: CreateApiKeyRequest): Promise<ApiKey> {
    if (this.useMock) {
      logger.info(`使用模拟数据创建API密钥, 用户ID: ${userId}, 名称: ${request.name}`);
      
      // 生成API密钥
      const key = `sk_${uuidv4().replace(/-/g, '')}`;
      const maskedKey = `sk_${'•'.repeat(16)}${key.slice(-4)}`;
      
      // 创建新API密钥
      const newApiKey: ApiKey = {
        id: uuidv4(),
        name: request.name,
        key, // 仅返回一次
        masked_key: maskedKey,
        user_id: userId,
        scopes: request.scopes,
        expires_at: request.expires_at,
        created_at: new Date().toISOString()
      };
      
      // 存储版本（不包含完整密钥）
      const storedKey = { ...newApiKey };
      delete storedKey.key;
      mockApiKeys.push(storedKey);
      
      return newApiKey;
    }
    
    try {
      logger.info(`向后端API创建API密钥, 用户ID: ${userId}, 名称: ${request.name}`);
      const response = await axios.post<ApiKey>(
        `${this.apiUrl}/api/auth/api-keys`, 
        { ...request, user_id: userId }
      );
      return response.data;
    } catch (error) {
      logger.error(`创建API密钥失败, 用户ID: ${userId}:`, error);
      throw new Error('创建API密钥失败');
    }
  }
  
  /**
   * 删除API密钥
   */
  async deleteApiKey(keyId: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据删除API密钥, 密钥ID: ${keyId}`);
      
      const index = mockApiKeys.findIndex(k => k.id === keyId);
      if (index === -1) {
        return false;
      }
      
      mockApiKeys.splice(index, 1);
      return true;
    }
    
    try {
      logger.info(`向后端API删除API密钥, 密钥ID: ${keyId}`);
      await axios.delete(`${this.apiUrl}/api/auth/api-keys/${keyId}`);
      return true;
    } catch (error) {
      logger.error(`删除API密钥失败, 密钥ID: ${keyId}:`, error);
      throw new Error('删除API密钥失败');
    }
  }
  
  /**
   * 修改密码
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据修改密码, 用户ID: ${userId}`);
      
      // 查找用户
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        logger.warn(`修改密码失败: 用户不存在 - ID: ${userId}`);
        throw new Error('用户不存在');
      }
      
      // 验证当前密码
      const isValid = await bcrypt.compare(currentPassword, mockUsers[userIndex].password);
      if (!isValid) {
        logger.warn(`修改密码失败: 当前密码错误 - ID: ${userId}`);
        throw new Error('当前密码错误');
      }
      
      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      mockUsers[userIndex].password = hashedPassword;
      
      return true;
    }
    
    try {
      logger.info(`向后端API修改密码, 用户ID: ${userId}`);
      await axios.post(`${this.apiUrl}/api/auth/change-password`, {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword
      });
      return true;
    } catch (error) {
      logger.error(`修改密码失败, 用户ID: ${userId}:`, error);
      throw new Error('修改密码失败');
    }
  }
  
  /**
   * 找回密码（发送重置链接）
   */
  async forgotPassword(email: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据发送密码重置邮件, 邮箱: ${email}`);
      
      // 检查邮箱是否存在
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        // 出于安全考虑，即使邮箱不存在也返回成功
        return true;
      }
      
      // 在实际系统中，这里会生成重置令牌并发送邮件
      
      return true;
    }
    
    try {
      logger.info(`向后端API发送密码重置请求, 邮箱: ${email}`);
      await axios.post(`${this.apiUrl}/api/auth/forgot-password`, { email });
      return true;
    } catch (error) {
      logger.error(`发送密码重置邮件失败, 邮箱: ${email}:`, error);
      throw new Error('发送密码重置邮件失败');
    }
  }
  
  /**
   * 重置密码
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    if (this.useMock) {
      logger.info(`使用模拟数据重置密码, 令牌: ${token.substring(0, 10)}...`);
      
      // 在实际系统中，这里会验证令牌并重置密码
      
      return true;
    }
    
    try {
      logger.info(`向后端API发送密码重置请求, 令牌: ${token.substring(0, 10)}...`);
      await axios.post(`${this.apiUrl}/api/auth/reset-password`, {
        token,
        new_password: newPassword
      });
      return true;
    } catch (error) {
      logger.error(`重置密码失败:`, error);
      throw new Error('重置密码失败，令牌可能已过期');
    }
  }
}

export const authService = new AuthService();
