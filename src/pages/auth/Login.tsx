import React, { useState } from 'react';
import { 
  Box, 
  Paper,
  useTheme,
  alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// 引入图标
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MemoryIcon from '@mui/icons-material/Memory';
// 引入子组件
import DecorativeSidebar from '../../components/auth/DecorativeSidebar';
import LoginForm from '../../components/auth/LoginForm';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setFormError(undefined);
    try {
      await login(username, password);
      // 登录成功后导航到dashboard
      navigate('/dashboard');
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : '登录失败，请检查您的用户名和密码。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 侧边栏特性列表 - 专业应用开发平台特点
  const features = [
    {
      icon: <PsychologyIcon fontSize="small" sx={{ color: 'white' }} />,
      text: '模型编排与调用',
    },
    {
      icon: <AnalyticsIcon fontSize="small" sx={{ color: 'white' }} />,
      text: '应用构建与部署',
    },
    {
      icon: <MemoryIcon fontSize="small" sx={{ color: 'white' }} />,
      text: '向量知识库管理',
    },
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', width: '100%' }}>
      {/* 左侧装饰栏 */}
      <DecorativeSidebar 
        type="login"
        title="智政开发平台"
        description="登录账号，开启智能应用构建之旅"
        features={features}
      />

      {/* 右侧登录区域 */}
      <Box
        sx={{
          width: { xs: '100%', sm: '60%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 4, sm: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(120deg, ${alpha('#e8f5fe', 0.5)} 0%, ${alpha('#e0f7fa', 0.5)} 100%)`,
            zIndex: -1
          }
        }}
      >
        <Box
          sx={{
            maxWidth: 450,
            width: '100%',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              pt: 3,
              borderRadius: 3,
              width: '100%',
              background: `linear-gradient(120deg, ${alpha('#f5f7fa', 0.6)} 0%, ${alpha('#e4ecf7', 0.6)} 100%)`,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                height: '6px',
                top: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%)',
                borderRadius: '4px 4px 0 0',
              }
            }}
          >
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box
                sx={{
                  typography: 'h5',
                  fontWeight: 700,
                  color: '#3498db',
                  mb: 1,
                }}
              >
                登录
              </Box>
              <Box
                sx={{
                  typography: 'body2',
                  color: '#2c3e50',
                  mb: 1,
                  maxWidth: '80%',
                  mx: 'auto',
                }}
              >
                登录您的账号以访问智政大模型应用平台
              </Box>
            </Box>
            
            {/* 引入登录表单组件 */}
            <LoginForm 
              onSubmit={handleLogin} 
              isLoading={isLoading} 
              formError={formError} 
            />
            
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
