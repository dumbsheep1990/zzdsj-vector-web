import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';

// 添加Z Logo的CSS动画样式
const logoStyles = `
  @keyframes logoShimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    50% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
    100% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
  }
`;

// 注入样式到页面
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = logoStyles;
  if (!document.head.querySelector('style[data-z-logo]')) {
    styleElement.setAttribute('data-z-logo', 'true');
    document.head.appendChild(styleElement);
  }
}

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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          {/* Z Logo 设计 */}
          <div style={{
            width: '64px',
            height: '64px',
            marginRight: '1rem',
            background: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 8px 25px rgba(0, 201, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            overflow: 'hidden'
          }}>
            {/* Z字母设计 */}
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#ffffff',
              fontFamily: 'Arial Black, sans-serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              transform: 'perspective(100px) rotateX(10deg)',
              position: 'relative',
              zIndex: 2
            }}>
              Z
            </div>
            
            {/* 背景装饰效果 */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              animation: 'logoShimmer 3s ease-in-out infinite',
              zIndex: 1
            }} />
          </div>
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
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
            NextAgent
          </Typography>
        </div>
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

      {/* 功能特点卡片 */}
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
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={0}
                sx={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.25) 0%, rgba(30, 41, 59, 0.3) 50%, rgba(0, 0, 0, 0.2) 100%) !important',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderLeft: '3px solid rgba(146, 254, 157, 0.9)',
                  borderRadius: '12px',
                  boxShadow: `
                    0 4px 16px rgba(0, 0, 0, 0.2), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(30, 41, 59, 0.4) 50%, rgba(0, 0, 0, 0.3) 100%) !important',
                    transform: 'translateX(4px)',
                    boxShadow: `
                      0 6px 20px rgba(0, 0, 0, 0.25), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.15),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.15)
                    `,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 100%)',
                  }
                }}
              >
                <Box sx={{ 
                  p: 2.5,
                  pl: 3,
                  display: 'flex', 
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <Box
                    sx={{
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(146, 254, 157, 0.8) 0%, rgba(0, 201, 255, 0.6) 100%)',
                      boxShadow: `
                        0 3px 8px rgba(0, 0, 0, 0.15), 
                        inset 0 1px 1px rgba(255, 255, 255, 0.3)
                      `,
                      position: 'relative',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.2px',
                      color: '#ffffff',
                      flex: 1,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {feature.text}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
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
