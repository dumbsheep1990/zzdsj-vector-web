import React from 'react';
import { Box, Typography } from '@mui/material';

// 侧边栏装饰组件接口定义
interface DecorativeSidebarProps {
  type: 'login' | 'register';  // 用于区分登录侧边栏和注册侧边栏的样式
  title: string;
  description: string;
  features: { icon: React.ReactNode; text: string }[];
}

const DecorativeSidebar: React.FC<DecorativeSidebarProps> = ({ 
  type, 
  title, 
  description, 
  features 
}) => {
  // 登录和注册页面统一使用相同的渐变色背景 - 科技蓝为主的柔和渐变色
  const backgroundGradient = 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%)';
  
  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'flex' },
        width: { sm: '40%', md: '50%' },
        background: backgroundGradient,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* 简约的背景光晕效果 */}
      <Box 
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)',
          filter: 'blur(70px)',
          zIndex: 1,
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '0%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(90px)',
          zIndex: 1,
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          filter: 'blur(60px)',
          zIndex: 1,
        }}
      />

      {/* 顶部标题区域 */}
      <Box sx={{ p: 6, pt: 10, position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            mb: 4,
            fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3rem' },
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '60px',
              height: 3,
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: 2,
            },
          }}
        >
          智政大模型应用平台
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            opacity: 0.95,
            mb: 2.5,
            fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 400,
            opacity: 0.9,
            mb: 4,
            maxWidth: '90%',
            lineHeight: 1.7,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* 功能特点列表 */}
      <Box sx={{ px: 6, py: 4, position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontWeight: 600,
            opacity: 0.95,
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
            position: 'relative',
            display: 'inline-block',
            paddingBottom: 1.5,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '40px',
              height: 2,
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 1,
            },
          }}
        >
          核心功能特点
        </Typography>
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3.5,
              transform: 'translateX(0)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(10px)',
                '& .feature-icon-box': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                }
              },
            }}
          >
            <Box
              className="feature-icon-box"
              sx={{
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              {feature.icon}
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                opacity: 0.95,
                fontSize: '1.15rem',
                letterSpacing: '0.3px',
              }}
            >
              {feature.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 页脚 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 6,
          pt: 4,
          mt: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            opacity: 0.7,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          2025 智政科技 智慧政务 高效服务 创新驱动
        </Typography>
      </Box>
    </Box>
  );
};

export default DecorativeSidebar;
