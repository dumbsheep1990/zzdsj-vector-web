import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  agreeTerms?: boolean;
}

const defaultState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // 在初始加载时尝试从localStorage获取认证状态
    const storedState = localStorage.getItem('authState');
    return storedState ? JSON.parse(storedState) : defaultState;
  });

  // 当认证状态变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(authState));
  }, [authState]);

  const login = async (username: string, password: string) => {
    try {
      // 测试账号直接登录，无需API请求
      if (username === 'test_user' && password === 'test123456') {
        const testUser = {
          id: 'test-user-id',
          username: 'test_user',
          email: 'test@zhizheng.com',
          full_name: '测试用户',
          roles: ['user', 'tester']
        };
        
        setAuthState({
          isAuthenticated: true,
          user: testUser,
          accessToken: 'test-token',
          refreshToken: 'test-refresh-token',
        });
        
        return;
      }
      
      // 正常登录流程
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '登录失败');
      }

      const data = await response.json();
      
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '注册失败');
      }

      // 注册成功后，自动登录用户
      await login(userData.username, userData.password);
    } catch (error) {
      console.error('注册错误:', error);
      throw error;
    }
  };

  const logout = () => {
    setAuthState(defaultState);
    localStorage.removeItem('authState');
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!authState.refreshToken) {
      return false;
    }

    try {
      const response = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: authState.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('令牌刷新失败');
      }

      const data = await response.json();
      setAuthState(prev => ({
        ...prev,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }));
      return true;
    } catch (error) {
      console.error('令牌刷新错误:', error);
      // 如果刷新失败，登出用户
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};
