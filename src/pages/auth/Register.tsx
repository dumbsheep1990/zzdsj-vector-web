import React, { useState } from 'react';
import { 
  Box, 
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth, RegisterData } from '../../context/AuthContext';
// 引入图标用于增强视觉效果
import RocketIcon from '@mui/icons-material/Rocket';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SupportIcon from '@mui/icons-material/Support';
// 引入子组件
import DecorativeSidebar from '../../components/auth/DecorativeSidebar';
import RegisterForm from '../../components/auth/RegisterForm';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleRegister = async (formData: RegisterData) => {
    setIsLoading(true);
    setFormError(undefined);
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = '注册失败，请稍后再试';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 侧边栏特性列表 - 专业应用开发平台特点
  const features = [
    {
      icon: <RocketIcon fontSize="small" sx={{ color: 'white' }} />,
      text: '快速原型构建',
    },
    {
      icon: <StarOutlineIcon fontSize="small" sx={{ color: 'white' }} />,
      text: '多模型集成调用',
    },
    {
      icon: <ShieldOutlinedIcon fontSize="small" sx={{ color: 'white' }} />,
      text: '安全的数据处理',
    },
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', width: '100%' }}>
      {/* 左侧装饰栏 */}
      <DecorativeSidebar 
        type="register"
        title="智政开发平台"
        description="注册账号，构建专属智能应用"
        features={features}
      />

      {/* 右侧注册区域 */}
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
            background: `linear-gradient(120deg, ${alpha('#e6fcf5', 0.5)} 0%, ${alpha('#e3fafc', 0.5)} 100%)`,
            zIndex: -1
          }
        }}
      >
        <Box
          sx={{
            maxWidth: 500,
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `
                0 10px 25px rgba(0, 201, 255, 0.07),
                0 6px 12px rgba(0, 201, 255, 0.05),
                inset 0 -2px 5px rgba(255, 255, 255, 0.8),
                inset 0 2px 0 rgba(255, 255, 255, 0.8),
                0 0 0 1px rgba(0, 201, 255, 0.1)
              `,
              border: '1px solid rgba(255, 255, 255, 0.8)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 3,
                padding: '2px',
                background: 'linear-gradient(135deg, rgba(0, 201, 255, 0.2), rgba(146, 254, 157, 0.2))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none'
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
                注册
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
                创建您的账号，开始使用智政大模型应用平台
              </Box>
            </Box>
            
            {/* 引入注册表单组件 */}
            <RegisterForm 
              onSubmit={handleRegister} 
              isLoading={isLoading} 
              formError={formError} 
            />
            
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
